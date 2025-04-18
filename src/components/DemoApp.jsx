import { useState, useEffect } from "react";
import Image from 'next/image';
import { linkAccount, checkConnectionStatus, linkShopifyAccount } from "../utils/composio_utils";
import ExecuteActionPopup from "./ExecuteActionPopup";
import { useSnackbar } from 'notistack'
import ShopifyConnectPopup from "./ShopifyConnectPopup";
import { MoonLoader } from "react-spinners"
import { driverObjDemoLoggedOut, driverObjDemoLoggedIn } from "../utils/driver_config_utils";
// import HelpButton from "./HelpButton";
// const driver = window.driver.js.driver;
import { driver } from "driver.js";
import 'driver.js/dist/driver.css'


const DemoApp = ({ logo, title, description, user, appName, action, setOpen, logoRounded = false, actionDescription, inputRequired = false, inputValue = "input required", connectViaAPI = false, demoApp = false, actionExecutedMessage = "" }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [handleDriverDemoLoggedOut, setHandleDriverDemoLoggedOut] = useState(null);
    const [shopifyConnectPopupOpen, setShopifyConnectPopupOpen] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [actionExecuting, setActionExecuting] = useState(false);
    const [executeActionPopupOpen, setExecuteActionPopupOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        // const drive = () => {
        //     driver(driverObjDemoLoggedOut).drive();
        // }
        // setHandleDriverDemoLoggedOut(() => drive); 
        if (!user) {
            driver(driverObjDemoLoggedOut).drive();
        } else {
            driver(driverObjDemoLoggedIn).drive();
        }
    }, [user]);

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
        } else {
            setIsConnected(false);
        }
    }, [user, shopifyConnectPopupOpen]);

    const handleConnect = async () => {
        if (user) {
            if (connectViaAPI) {
                await linkShopifyAccount(user.email.split("@")[0], admin_api_access_token, shopSubDomain, appName);
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

    const handleConnectViaAPI = async () => {
        console.log("\n\nhandleConnectViaAPI");
        if (user) {
            setShopifyConnectPopupOpen(true);
        } else {
            setOpen(true);
        }
    };

    const handleAction = async () => {
        if (user) {
            try {
                setExecuteActionPopupOpen(true);
                setActionExecuting(true);
                if (appName === "SHOPIFY") {
                    const response = await action(user.email.split("@")[0])
                    enqueueSnackbar(response, { variant: "default" });
                } else {
                    await action(user.email.split("@")[0])
                }
            } catch (error) {
                alert(error.message);
                enqueueSnackbar("Action execution failed", { variant: "error" });
            } finally {
                setActionExecuting(false);
                setExecuteActionPopupOpen(false);
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
        <div id="demo-app-container" className="flex flex-col gap-6 border border-gray-300 rounded-lg p-8 w-[22rem] h-[21rem]">
            {
                connectViaAPI && <ShopifyConnectPopup open={shopifyConnectPopupOpen} setOpen={setShopifyConnectPopupOpen} user={user} />
            }
            {
                inputRequired ? (
                    <ExecuteActionPopup actionExecuting={actionExecuting} open={executeActionPopupOpen} setOpen={setExecuteActionPopupOpen} action={handleActionWithInput} actionDescription={actionDescription} inputRequired={inputRequired} inputValue={inputValue} />
                ) : (
                    <ExecuteActionPopup actionExecuting={actionExecuting} open={executeActionPopupOpen} setOpen={setExecuteActionPopupOpen} action={handleAction} actionDescription={actionDescription} inputRequired={inputRequired} inputValue={inputValue} />
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
                <p className="text-sm text-gray-500 pt-1">{description}</p>
            </div>
            <div className="mx-auto w-full">
                {!isConnected ? (
                    <button
                        id={demoApp ? "connect-accounts-button" : ""}
                        type="button"
                        className="flex mx-auto justify-center items-center focus:outline-none text-white w-full bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 h-[2.5rem]"
                        onClick={connectViaAPI ?  handleConnectViaAPI : handleConnect}
                    >
                        {connecting ? <MoonLoader color={"#ffffff"} loading={true} size={16} /> : "Connect"}
                    </button>
                ) : (
                    <button
                        id={demoApp ? "execute-action-button" : ""}
                        type="button"
                        className="focus:outline-none text-white w-full bg-green-600 hover:bg-green-800 font-medium rounded-lg text-sm px-5 h-[2.5rem]"
                        onClick={() => setExecuteActionPopupOpen(true)}
                    >
                        {/* {actionExecuting ? <MoonLoader color={"#ffffff"} loading={true} size={16} /> : "Perform Action"} */}
                        Perform Action
                    </button>
                )}
            </div>
        </div>
    );
}

export default DemoApp;
