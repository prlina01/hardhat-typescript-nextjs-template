import {SetStateAction, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import Link from "next/link";

export default () => {
    const [msg, setMsg] = useState<string>("")
    const {reset, register, handleSubmit, formState} = useForm()

    const onSubmit = (input: { [x: string]: SetStateAction<string>; } ) => {
        setMsg(input["msg"])
    }

    useEffect(() => {
        reset({
            "msg": ""
        })
    }, [reset, formState.isSubmitSuccessful])
    return(
        <>
            {
                msg ?
                    (<h1>{msg}</h1>)
                    :
                    (<h1>Msg has not been set!</h1>)
            }
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>
                    Change Msg:
                </label>
                <input type="text" {...register("msg")} />
                <input type="submit" value="Submit"/>
            </form>
            <Link href="/">Go to index page</Link>
        </>


    )
}