"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`full_name, username, website, avatar_url`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        setFullname(data.full_name);
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert("Error loading user data!");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string | null;
    fullname: string | null;
    website: string | null;
    avatar_url: string | null;
  }) {
    try {
      setLoading(true);

      const { error } = await supabase.from("profiles").upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert("Profile updated!");
    } catch (error) {
      alert("Error updating the data!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-widget my-2">
      <div className="flex items-center mb-2 mr-4">
        <label className="p-2 w-32 text-right" htmlFor="email">
          Email
        </label>
        <Input
          className="p-2 flex-1"
          id="email"
          type="text"
          value={user?.email}
          disabled
        />
      </div>
      <div className="flex items-center mb-2 mr-4">
        <label className="p-2 w-32 text-right" htmlFor="fullName">Full Name</label>
        <Input
          id="fullName"
          className="p-2 flex-1"
          type="text"
          value={fullname || ""}
          onChange={(e) => setFullname(e.target.value)}
        />
      </div>
      <div className="flex items-center mb-2 mr-4">
        <label className="p-2 w-32 text-right" htmlFor="username">Username</label>
        <Input
          id="username"
          className="p-2 flex-1"
          type="text"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="flex items-center mb-2 mr-4">
        <label className="p-2 w-32 text-right" htmlFor="website">Website</label>
        <Input
          className="p-2 flex-1"
          id="website"
          type="url"
          value={website || ""}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="flex justify-center items-center p-2">
      <div>
        <Button
          className="button primary block mx-1"
          color="primary"
          onClick={() =>
            updateProfile({ fullname, username, website, avatar_url })
          }
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </Button>
      </div>

      <div >
        <form action="/auth/signout" method="post">
          <Button className="button block mx-1" color="danger" type="submit">
            Sign out
          </Button>
        </form>
      </div>
    </div>
    </div>
  );
}
