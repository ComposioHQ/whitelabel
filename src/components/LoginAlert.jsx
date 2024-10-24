'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

export default function LoginAlert({ open, setOpen, action }) {
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
                            <div className="mt-3 text-center sm:mt-5">
                                <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                    Please Login to continue with the demo
                                </DialogTitle>
                            </div>
                        </div>
                        <div className="mt-5 sm:mt-6 flex justify-center gap-4">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="inline-flex justify-center rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={action}
                                className="bg-purple-700 hover:bg-purple-800 inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                            >
                                Login
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}