"use client";
import { login, signup } from "./actions";
import { useState } from "react";
import { Input, Form, Button } from "@heroui/react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

export default function LoginPage() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Form className="w-full justify-center items-center">
      <div className="w-96 pt-4 pb-2">
        <Input
          isRequired
          placeholder="johndoe@gmail.com"
          label="Email"
          type="email"
          id="email"
          name="email"
          variant="bordered"
        />
      </div>
      <div className="w-96 pt-2">
        <Input
          isRequired
          id="password"
          name="password"
          endContent={
            <button
              aria-label="toggle password visibility"
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <IoMdEye className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <IoMdEyeOff className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          label="Password"
          placeholder="Enter your password"
          type={isVisible ? "text" : "password"}
          variant="bordered"
        />
      </div>
      <div>
        <Button
          type="submit"
          color="primary"
          formAction={login}
          className="mr-2"
        >
          Log in
        </Button>
        <Button type="submit" color="secondary" formAction={signup}>
          Sign up
        </Button>
      </div>
    </Form>
  );
}
