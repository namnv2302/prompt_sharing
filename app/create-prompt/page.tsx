"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Form from "@components/Form";

const CreatePrompt = () => {
  const { data: session }: any = useSession();
  const router = useRouter();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [post, setPost] = useState<{ prompt: string; tag: string }>({
    prompt: "",
    tag: "",
  });

  const createPrompt = useCallback(
    async (e: any) => {
      e.preventDefault();
      setSubmitting(true);
      try {
        const resp = await fetch("/api/prompt/new", {
          method: "POST",
          body: JSON.stringify({
            ...post,
            userId: session?.user.id,
          }),
        });
        if (resp.ok) {
          router.push("/");
          setSubmitting(false);
        }
      } catch (error: any) {
        setSubmitting(false);
        console.log(error.message);
      }
    },
    [post, session, router]
  );

  return (
    <Form
      type="Create"
      post={post}
      setPost={setPost}
      submitting={submitting}
      onSubmit={createPrompt}
    />
  );
};

export default CreatePrompt;
