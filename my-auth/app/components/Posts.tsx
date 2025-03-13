import Image from "next/image";

export default function Posts() {
  const posts = [
    {
      id: 1,
      user: "Ayşe Yılmaz",
      content: "Bugün harika bir gün! ☀️",
      image: "/orman.jpg",
      tags: ["#Tatil", "#Güneş"],
      createdAt: "2 saat önce",
    },
    {
      id: 2,
      user: "Ali Kaya",
      content: "Yeni bir proje üzerinde çalışıyorum! 🚀",
      tags: ["#Yazılım", "#Proje"],
      createdAt: "1 gün önce",
    },
  ];

  return (
    <div className=" rounded-md shadow-md space-y-3">
      {posts.map((post) => (
        <div key={post.id} className="p-4 rounded-lg bg-white  shadow-md space-y-6">
          <div className="flex items-center">
            <Image
              src="/3.jpg"
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="ml-3">
              <h3 className=" font-semibold">{post.user}</h3>
              <p className="text-gray-300 text-sm">{post.createdAt}</p>
            </div>
          </div>
          <p className="mt-2 ">{post.content}</p>
          {post.image && (
            <Image
              src={post.image}
              alt="Post"
              width={400}
              height={200}
              className="mt-2 rounded-lg w-full object-cover"
            />
          )}
          <div className="mt-2 flex space-x-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-blue-400 text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>

      ))}
    </div>
  );
}