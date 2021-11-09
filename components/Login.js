import Button from "@material-tailwind/react/Button";
import Image from "next/image";
import { signIn } from "next-auth/client";

function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Image
        src="https://raw.githubusercontent.com/SedatCeyhan/LogoStorage/82b4b8e6dcf9340f517a86e56e2991eb3afb8cc2/docsApp-1.svg"
        height="300"
        width="550"
        objectFit="contain"
      />

      <Button
        className="w-44 mt-10"
        color="gray"
        buttonType="filled"
        ripple="light"
        onClick={signIn}
      >
        Login
      </Button>
    </div>
  );
}

export default Login;
