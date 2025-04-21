import CreatePostForm from "@/app/components/CreatePostForm"


export default async function CreatePage({params}:{params:{postId:string}}){
    return (
    <div className="max-w-2xl mx-auto ">
      
      <CreatePostForm />
    </div>
  );
}