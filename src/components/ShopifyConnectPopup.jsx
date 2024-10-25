import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Description } from '@headlessui/react'
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { linkShopifyAccount } from '../utils/composio_utils';
import { MoonLoader } from "react-spinners"
import axios from 'axios';

// Assume this response comes from an API endpoint
const response = [
    {
        "name": "admin_api_access_token",
        "type": "string",
        "description": "Your Admin api acess token for authentication which can be generated from your Shopify app settings. Create a Shopify app and configure the required scopes. You can access your app settings and generate the token by visiting https://admin.shopify.com/store/<store-name>/settings/apps/development",
        "display_name": "Admin Api Access Token",
        "default": null,
        "required": true,
        "get_current_user_endpoint": null,
        "expected_from_customer": true,
        "is_secret": false,
        "displayName": "Admin Api Access Token"
    },
    {
        "name": "shop",
        "type": "string",
        "description": "Your Shopify store's subdomain (e.g., your-store-name in your-store-name.myshopify.com)",
        "display_name": "Store Subdomain",
        "default": null,
        "required": true,
        "get_current_user_endpoint": null,
        "expected_from_customer": true,
        "is_secret": false,
        "displayName": "Store Subdomain"
    }
]

export default function ShopifyConnectPopup({ open, setOpen, user }) {
    const [formData, setFormData] = useState({});
    const [connecting, setConnecting] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [expectedParams, setExpectedParams] = useState([]);

    useEffect(() => {
        const initialData = {};
        const fetchExpectedParams = async () => {
            try {
                const response = await axios.post('/api/expectedparams', { appName: 'SHOPIFY' });
                setExpectedParams(response.data.expectedInputFields);
                expectedParams.forEach(field => {
                    initialData[field.name] = field.default || '';
                });
                setFormData(initialData);
            } catch (error) {
                console.error('Error fetching expected params:', error);
                enqueueSnackbar('Failed to fetch connection parameters', { variant: 'error' });
            }
        };
        fetchExpectedParams();
    }, []);

    const handleInputChange = (e, fieldName) => {
        setFormData(prevData => ({
            ...prevData,
            [fieldName]: e.target.value
        }));
    };

    const handleConnect = async () => {
        setConnecting(true);
        const missingFields = response.filter(field => field.required && !formData[field.name]);
        if (missingFields.length > 0) {
            enqueueSnackbar("Please fill in all required fields", { variant: "error" });
            setConnecting(false);
            return;
        }

        // Create a dynamic object for linkShopifyAccount
        const accountData = {
            entityId: user && user.email.split("@")[0],
            appName: "SHOPIFY",
            ...formData
        };

        try {
            const result = await linkShopifyAccount(accountData);
            if (result === true) {    
                enqueueSnackbar("Account connected successfully", { variant: "success" });
                setOpen(false);
            } else {
                enqueueSnackbar("Failed to connect account", { variant: "error" });
            }
        } catch (error) {
            console.error("Error connecting account:", error);
            enqueueSnackbar("An error occurred while connecting the account", { variant: "error" });
        } finally {
            setConnecting(false);
        }
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
                                    Enter the required information to connect your Shopify store.
                                </Description>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            {response.map((field) => (
                                <div key={field.name}>
                                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                                        {field.display_name}
                                        {field.required && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        id={field.name}
                                        type={field.is_secret ? "password" : "text"}
                                        className="h-[2.5rem] block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        placeholder={field.display_name}
                                        value={formData[field.name] || ''}
                                        onChange={(e) => handleInputChange(e, field.name)}
                                        required={field.required}
                                        autoComplete={field.is_secret ? "off" : "on"}
                                    />
                                    {field.description && (
                                        <p className="mt-1 text-sm text-gray-500">{field.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-5 sm:mt-6 flex justify-center gap-4">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConnect}
                                className="w-20 bg-purple-700 hover:bg-purple-800 inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                            >
                                {connecting ? <MoonLoader color={"#ffffff"} loading={true} size={16} /> : "Proceed"}
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}
