import { useSession } from "next-auth/react";

export default function HomeHeader(){
    const {data: session} = useSession();
    return (
        <div className="text-blue-900 flex justify-between">
            <h2 className="mt-0">
                Hola, <b>{session?.user?.name}</b>
            </h2>
            <div className="hidden sm:block">
                <div className="bg-gray-300 flex text-black gap-1 rounded-lg overflow-hidden">
                    <img src={session?.user?.image} alt="image of user" className="w-6 h-6"/>
                    <span className="px-2">
                        {session?.user?.name}
                    </span>
                </div>
            </div>
        </div>
    )
}