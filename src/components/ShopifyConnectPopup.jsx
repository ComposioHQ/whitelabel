import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Description } from '@headlessui/react'
// import 'rsuite/Loader/styles/index.css';
// import { Loader } from 'rsuite';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { linkShopifyAccount } from '../utils/composio_utils';

export default function ShopifyConnectPopup({ open, setOpen, user }) {
    const [admin_api_access_token, setAdminApiAccessToken] = useState("");
    const [shopify_domain, setShopifyDomain] = useState("");
    const { enqueueSnackbar } = useSnackbar();
    const handleConnect = async () => {
        if (admin_api_access_token === "" || shopify_domain === "") {
            enqueueSnackbar("Please enter all the details", { variant: "error" });
            return;
        }
        const response = await linkShopifyAccount(user.email.split("@")[0], admin_api_access_token, shopify_domain, "SHOPIFY");
        if (response === true) {    
            enqueueSnackbar("Account connected successfully", { variant: "success" });
        } else {
            enqueueSnackbar("Failed to connect account", { variant: "error" });
        }
        setOpen(false);
    }
    return (
        <Dialog open={open} onClose={setOpen} className="relative z-20">
            <DialogBackdrop
                className="fixed inset-0 bg-gray-500 bg-opacity-75"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
                    >
                        <div>
                            <div className="text-center">
                                <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900 text-xl my-2">
                                    Enter Details
                                </DialogTitle>
                                <Description className="my-6">
                                    Enter the Shopify admin API access token and domain to connect your Shopify store to Slack.
                                </Description>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div>
                                <input
                                    className={`h-[2.5rem] block w-full ml-auto rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 py-1.5 px-3 focus:outline-none`}
                                    placeholder="Shopify Admin API Access Token"
                                    onChange={(e) => {
                                        setAdminApiAccessToken(e.target.value);
                                    }}
                                    autoComplete="off"
                                ></input>
                            </div>
                            <div>
                                <input
                                    className={`h-[2.5rem] block w-full ml-auto rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 py-1.5 px-3 focus:outline-none`}
                                    placeholder="Shopify Domain"
                                    onChange={(e) => {
                                        setShopifyDomain(e.target.value);
                                    }}
                                    autoComplete="off"
                                ></input>
                            </div>
                        </div>
                        <div className="mt-5 sm:mt-6 flex justify-center gap-4">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-gray-200 text-white-400"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConnect}
                                className="w-20 bg-purple-700 hover:bg-purple-800 inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                            >
                                {/* {actionExecuting ? <Loader speed="slow" size="sm" /> : "Proceed"} */}
                                Connect
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}