import {Spinner} from "@/components/ui/spinner";


const Loading = () => {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Spinner className="size-8" />
        </div>
    );
};

export default Loading;