import { updatePost } from "../../../actions/actions"
import { prisma } from "../../../lib/db"
import { notFound, redirect } from "next/navigation"
import { auth } from "../../../../auth"
export default async function EditPostPage(props:{params:Promise<{postId:string}>}){
    const session = await auth()

    const { postId } = await props.params;
    const post= await prisma.post.findUnique({
        where:{
            id:postId,
        },
        include:{
            author:true,
        }
    })
    if(!post){
        return notFound()
    }
    if(session?.user?.email !== post.author.email){
        redirect('/posts')
    }
   
    const updatePostWithId= updatePost.bind(null,post.id)
    return(
        <main className="flex flex-col items-center gap-y-5 pt-24 text-center">
            <h2 className="border-t border-b border-black/10 py-5 leading-8">Edit Post</h2>
            <form action={updatePostWithId} className="flex flex-col items-center gap-4">

            <input 
            type="text"
            name="title"
            className="border border-gray-300 p-2 rounded w-64"
            defaultValue={post.title}
            ></input>
            {/* <textarea
             name="content"
            defaultValue={post.content ||''}
            className="border border-gray-300 p-2 rounded w-64 h-32"
            placeholder="Content"
            /> */}
          
                 <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Update Post
                </button>
            </form>
        </main>
    )

}