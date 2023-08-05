"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Profile from "@components/Profile";

const MyProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [myPosts, setMyPosts] = useState<any>([]);

  useEffect(() => {
    (async () => {
      if (session?.user) {
        const resp = await fetch(`/api/users/${session?.user?.id}/posts`);
        const data = await resp.json();
        setMyPosts(data);
      } else {
        return;
      }
    })();
  }, [session?.user]);

  const handleEdit = useCallback(
    (post: any) => {
      return router.push(`/update-prompt?id=${post._id}`);
    },
    [router]
  );

  const handleDelete = useCallback(
    async (post: any) => {
      const hasConfirmed = confirm("Are you sure want to delete?");
      if (hasConfirmed) {
        try {
          const resp = await fetch(`/api/prompt/${post._id.toString()}`, {
            method: "DELETE",
          });
          if (resp.ok) {
            const filteredPosts = myPosts.filter(
              (p: any) => p._id !== post._id
            );
            setMyPosts(filteredPosts);
          }
        } catch (error: any) {
          console.log(error.message);
        }
      }
    },
    [myPosts]
  );

  return (
    <Profile
      name="My"
      description="Welcome to your personalized profile page. Share your exceptional prompts and inspire others with the power of your imagination"
      data={myPosts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
