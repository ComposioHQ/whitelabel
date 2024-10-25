import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Description } from '@headlessui/react'
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import MoonLoader from "react-spinners/MoonLoader";

export default function ExecuteActionPopup({ open, setOpen, action, actionDescription, actionExecuting, inputRequired, inputValue }) {
    const [value, setValue] = useState("");
    const { enqueueSnackbar } = useSnackbar();
    const actionWithInput = () => {
        if (inputRequired) {
            if (value) {
                action(value);
            } else {
                enqueueSnackbar("Please enter a value", { variant: "error" });
            }
        } else {
            action();
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
                                    Execute Action
                                </DialogTitle>
                                <Description className="my-6">
                                    {actionDescription}
                                </Description>
                            </div>
                        </div>
                        {
                            inputRequired && (
                                <div>
                                    <input
                                        className={`h-[2.5rem] block w-full ml-auto rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 py-1.5 px-3 focus:outline-none`}
                                        placeholder={inputValue && inputValue}
                                        onChange={(e) => {
                                            setValue(e.target.value);
                                        }}
                                        autoComplete="off"
                                    ></input>
                                </div>
                            )
                        }
                        <div className="mt-5 sm:mt-6 flex justify-center gap-4">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                disabled={actionExecuting}
                                className={`inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${actionExecuting
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-300 text-gray-700 hover:bg-gray-200 focus-visible:outline-gray-600'
                                    }`}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={inputRequired ? () => actionWithInput() : action}
                                className="w-20 bg-purple-700 hover:bg-purple-800 inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                            >
                                {actionExecuting ? <MoonLoader color={"#ffffff"} loading={true} size={16} /> : "Proceed"}
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}