import { useState, useEffect } from "react";
import Image from 'next/image';
// import 'rsuite/Loader/styles/index.css';
// import { Loader } from 'rsuite';
import { linkAccount, checkConnectionStatus } from "../utils/composio_utils";
import ExecuteActionPopup from "./ExecuteActionPopup";
import { useSnackbar } from 'notistack'

const DemoApp = ({ logo, title, description, user, appName, action, setOpen, logoRounded=false, actionDescription, inputRequired=false, inputValue="input required", connectViaAPI=false}) => {
    const [isConnected, setIsConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [actionExecuting, setActionExecuting] = useState(false);
    const [executeActionPopupOpen, setExecuteActionPopupOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar()


    useEffect(() => {
        if (user) {
            const checkConnectionStatusHelper = async () => {
                try {
                    setConnecting(true);
                    const authenticated = await checkConnectionStatus(appName, setIsConnected, user.email.split("@")[0]);
                    if (authenticated === "yes") {
                        setIsConnected(true);
                    }
                } catch (error) {
                    alert(error.message);
                } finally {
                    setConnecting(false);
                }
            }
            checkConnectionStatusHelper();
        }else{
            setIsConnected(false);
        }
    }, [user]);

    const handleConnect = async () => {
        if (user) {
            if (connectViaAPI) {
                await linkAccountViaAPI(user.email.split("@")[0], appName);
            } else {
                try {
                    setConnecting(true);
                    let url = await linkAccount(user.email.split("@")[0], appName);
                    window.open(url, "_blank");
                } catch (error) {
                alert(error.message);
            } finally {
                setConnecting(false);
                }
            }
        } else {    
            setOpen(true);
        }
    };

    const handleAction = async () => {
        if (user) {
            try {
                setExecuteActionPopupOpen(true);
                setActionExecuting(true);
                await action(user.email.split("@")[0])
            } catch (error) {
                alert(error.message);
                enqueueSnackbar("Action execution failed", { variant: "error" });
            } finally {
                setActionExecuting(false);
                setExecuteActionPopupOpen(false);
                enqueueSnackbar("Action executed successfully", { variant: "success" });
            }
        } else {
            setOpen(true);
        }
    }

    const handleActionWithInput = async (input) => {
        if (user) {
            try {
                setExecuteActionPopupOpen(true);
                setActionExecuting(true);
                await action(user.email.split("@")[0], input)
            } catch (error) {
                alert(error.message);
                enqueueSnackbar("Action execution failed", { variant: "error" });
            } finally {
                setActionExecuting(false);
                setExecuteActionPopupOpen(false);
                enqueueSnackbar("Action executed successfully", { variant: "success" });
            }
        } else {
            setOpen(true);
        }
    }

    return (
        <div className="flex flex-col gap-8 border border-gray-300 rounded-lg p-8 w-[22rem] h-[21rem]">
            {
                inputRequired ? (   
                    <ExecuteActionPopup actionExecuting={actionExecuting} open={executeActionPopupOpen} setOpen={setExecuteActionPopupOpen} action={handleActionWithInput} actionDescription={actionDescription} inputRequired={inputRequired} inputValue={inputValue}/>
                ) : (
                    <ExecuteActionPopup actionExecuting={actionExecuting} open={executeActionPopupOpen} setOpen={setExecuteActionPopupOpen} action={handleAction} actionDescription={actionDescription} inputRequired={inputRequired} inputValue={inputValue}/>
                )
            }
            <div>
                <Image 
                    src={logo} 
                    alt="App Logo" 
                    className={`w-24 mx-auto ${logoRounded ? "rounded-xl" : ""}`}
                />
            </div>
            <div className="text-center">
                <p className="text-xl font-bold">{title}</p>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
            <div className="mx-auto w-full">
                {!isConnected ? (
                    <button
                        id="generate-retweet-quotes-for-existing-tweet-button"
                        type="button"
                        className="focus:outline-none text-white w-full bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 h-[2.5rem]"
                        onClick={handleConnect}
                    >
                        {/* {connecting ? <Loader speed="slow" size="sm" /> : "Connect"} */}
                        Connect
                    </button>
                ) : (
                    <button
                        id="generate-retweet-quotes-for-existing-tweet-button"
                        type="button"
                        className="focus:outline-none text-white w-full bg-green-600 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 h-[2.5rem]"
                        onClick={() => setExecuteActionPopupOpen(true)}
                    >
                        {/* {actionExecuting ? <Loader speed="slow" size="sm" /> : "Perform Action"} */}
                        Perform Action
                    </button>
                )}
            </div>
        </div>
    );
}

export default DemoApp;
