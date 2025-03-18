import { auth } from "@/auth";
import LoginPage from "./LoginPage";

export default async function Login() {
    const session = await auth(); // Check login
    return <LoginPage session={session} />;
}
