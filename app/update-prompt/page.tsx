"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Form from "@components/Form";

const UpdatePrompt = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const promptId = useMemo(() => searchParams.get("id"), [searchParams]);
  const [post, setPost] = useState({ prompt: "", tag: "" });
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (promptId) {
        const resp = await fetch(`/api/prompt/${promptId}`);
        const data = await resp.json();
        setPost(data);
      } else {
        return;
      }
    })();
  }, [promptId]);

  const updatePrompt = useCallback(
    async (e: any) => {
      e.preventDefault();
      setSubmitting(true);
      try {
        const resp = await fetch(`/api/prompt/${promptId}`, {
          method: "PATCH",
          body: JSON.stringify({
            prompt: post.prompt,
            tag: post.tag,
          }),
        });
        if (resp.ok) {
          router.push("/");
        }
        setSubmitting(false);
      } catch (error: any) {
        setSubmitting(false);
        console.log(error.message);
      }
    },
    [post, router, promptId]
  );

  return (
    <Form
      type="Update"
      post={post}
      setPost={setPost}
      submitting={submitting}
      onSubmit={updatePrompt}
    />
  );
};

export default UpdatePrompt;
