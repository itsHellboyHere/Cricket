"use server"

import { prisma } from "../lib/db"
import {  z } from 'zod';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "../../auth";
import { AuthError } from 'next-auth';
import { auth } from "../../auth";
import { CommentWithUser } from "../types";
import { createUser, getUserByEmail } from "../lib/db-utils";
import { hashPassword } from "../lib/auth-utils";



export type State = {
  errors?: {
    title?: string[];
    // content?: string[];
    imageUrl?: string[];
  };
  message?: string | null;
};

const FormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  // content:z.string().min(1,"Content is required"),
  imageUrl: z.string().url("Please provide a valid image URL").or(z.literal("")),

})
export async function createPost(prevState: State, formData: FormData) {
  const session = await auth()
  if (!session?.user?.email) {
    return {
      message: "Not authenticated"
    }
  }

  const rawData = {
    title: formData.get("title"),
    // content:formData.get("content"), 
    imageUrl: formData.get("imageUrl")
  }

  const validation = FormSchema.safeParse(rawData)
  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
      message: "Validation failed. Please check your input.",
    };

  }
  const validatedData = validation.data;
  try {
    // Generate unique slug
    let slug = validatedData.title.replace(/\s+/g, "-").toLowerCase();
    const originalSlug = slug;
    let counter = 1;

    while (await prisma.post.findUnique({ where: { slug } })) {
      slug = `${originalSlug}-${counter}`;
      counter += 1;
    }

    // Create post
    await prisma.post.create({
      data: {
        title: validatedData.title,
        // content: validatedData.content,
        imageUrl: validatedData.imageUrl,
        slug,
        author: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });


  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to create post.",
    };
  }
  revalidatePath("/posts")
  redirect("/posts")
}

const UpadteFormSchema = z.object({
  title: z.string(),

})
export async function updatePost(id: string, formData: FormData,) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }
  const rawData = {
    title: formData.get("title"),
  }

  const result = UpadteFormSchema.parse(rawData)
  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      author: {
        select: {
          email: true
        }
      }
    }
  });

  if (!post || post.author.email !== session.user.email) {
    throw new Error("Unauthorized: You can only edit your own posts");
  }
  await prisma.post.update({
    where: { id },
    data: {
      title: result.title,
    }
  })
  revalidatePath("/posts")
  redirect("/posts")
}
export async function deletePost(id: string) {
  // throw new Error('Failed to Delete Invoice');
  await prisma.post.delete({
    where: { id },
  })
  revalidatePath("/posts")
  redirect("/posts")
}


export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  }
  catch (error) {
    if (error instanceof AuthError) {
      console.log(error)
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.'
        default:
          'Something went wrong.'
      }
    }
    throw error
  }
}
const SignupSchema = z.object({
  username: z.string().min(3, 'Username is required'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});


export interface SignUpState {
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
    name?: string[];
  };
  message?: string | null;
  success?:boolean;
  credentials?:{
    email:string;
    password: string;
  }
  
}

export async function signUp(prevState: SignUpState, formData: FormData):Promise<SignUpState> {
  try {
    const rawData = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      name: formData.get("name"),
    }
    const validatedFields = SignupSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing or invalid fields. Please check your input.',
        success:false,
        credentials: undefined,
      };
    }
    const { username, name, email, password } = validatedFields.data;
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return {
        errors: { email: ['Email already in use'] },
        message: 'Email already in use',
        success: false,
        credentials: undefined,
      };
    }
    const hashedPassword = await hashPassword(password);
    const existingUsername = await prisma.user.findUnique({
      where: { username }
    })
    if (existingUsername) {
      return {
        errors: { username: ['Username taken. Try another.'] },
        message: 'Username already exists',
        success: false,
        credentials:undefined,
      }
    }
    await createUser({ username, email, password: hashedPassword, name })


    return {
      success: true,
      credentials: { email, password },
      errors: undefined,
      message: null,
    };
  }
  catch (error) {
    console.error('Signup error:', error);
    if (error instanceof AuthError) {
      return {
        errors: undefined,
           message: error.message,
        success: false,
        credentials: undefined
      };
    }
    return {
    errors: undefined,
      message: 'An error occurred during signup',
      success: false,
      credentials: undefined
    };
  }
}
export async function signInWithGithub() {
  await signIn('github', { redirectTo: '/posts' });
}

export async function signInWithGoogle() {
  await signIn('google', { redirectTo: '/posts' });
}
export async function toggleLike(postId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not logged in");

  const existingLike = await prisma.like.findFirst({
    where: { userId: session.user.id, postId },
  });


  const liked = !existingLike;

  if (existingLike) {
    await prisma.like.delete({ where: { id: existingLike.id } });
  } else {
    await prisma.like.create({ data: { userId: session.user.id, postId } });
  }


  revalidatePath("/posts");
  revalidatePath(`/posts/${postId}`);

  return { liked };
}
export async function addComment(postId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const newComment = await prisma.comment.create({
    data: {
      content,
      userId: session.user.id,
      postId
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          username: true,
        }
      }
    }
  });

  // revalidatePath(`/posts/${postId}`);
  revalidatePath(`/posts/${postId}`);

  return newComment;
}

export async function getComments(postId: string): Promise<CommentWithUser[]> {
  const comments = await prisma.comment.findMany({
    where: { postId },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  });
  return comments;
}

//  Update profile-pic image

export async function updateProfilePicture(userId: string, imageUrl: string) {
  const session = await auth()
  console.log(userId, session?.user.id);
  if (!session?.user || session.user.id !== userId) {
    return {
      success: false,
      error: "Unauthorized",
      status: 401
    }
  }

  try {
    // update database
    await prisma.user.update({
      where: { id: userId },
      data: { image: imageUrl },
    });


    return { success: true, status: 200 }
  }
  catch (error) {
    console.error('Avatar update failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update avatar",
      status: 500
    };
  }
}
// save toggle action

export async function toggleSave(userId: string, postId: string) {


  const session = await auth();
  if (!session?.user?.id) throw new Error("Not logged in");
  // check for existing save
  const existingSave = await prisma.savedPost.findUnique({
    where: {
      userId_postId: {
        userId,
        postId
      }
    }
  });
  const saved = !existingSave
  if (existingSave) {
    await prisma.savedPost.delete({
      where: {
        id: existingSave.id
      }
    })
  }
  else {
    await prisma.savedPost.create({
      data: {
        userId: userId,
        postId: postId
      }
    })
  }
  revalidatePath("/posts")
  revalidatePath(`/post/${postId}`)
  return { saved }
}