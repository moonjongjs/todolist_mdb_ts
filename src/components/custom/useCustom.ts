'use client';
import { useRouter } from "next/navigation";

export default function useCustomHook(){

    const router = useRouter();

    const onClickALink=(
        e: React.MouseEvent<HTMLAnchorElement> |  React.MouseEvent<HTMLElement>,
        pathName: string | null, 
        data?: any
        )=>{
        e.preventDefault();
        e.stopPropagation();

        if(pathName===null) return;
                
        if(/^https?:\/\//.test(pathName)){
            window.open(pathName);
            return;
        }
        else {
            console.log(  pathName );
            router.push(pathName);
        }   

        window.scrollTo({top: 0, left: 0, 'behavior': 'smooth'})   

    }

    return {
        onClickALink
    };
    
}