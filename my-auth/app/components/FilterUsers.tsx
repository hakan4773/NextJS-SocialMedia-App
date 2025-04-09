import Link from "next/link";
import React from "react";
import { UserType } from "../types/user";
export default function FilterUsers({
  filteredUsers,
}: {
  filteredUsers: UserType[];
}) {

  return (
    <div className="filter-container absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg "> 
     
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
           
            <Link href={`/users/${user._id}`}
              key={user._id}
              className="p-2 border-b border-gray-100 hover:bg-gray-100 hover:rounded-md flex items-center"
            >
              {user.profileImage && (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              {user.name}{" "}
            </Link>

          ))
        ) : (
          <p className="p-2 text-gray-500 ">Sonuç bulunamadı</p>
        )}{" "}
    </div>
  );
}
