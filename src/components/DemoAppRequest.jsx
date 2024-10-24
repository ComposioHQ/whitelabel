import { useState, useEffect, useRef } from "react";

const DemoAppRequest = () => {
    const [isOpen, setIsOpen] = useState(false);
    const popupRef = useRef(null);

    const openPopup = () => setIsOpen(true);
    const closePopup = () => setIsOpen(false);

    useEffect(() => {
        // Load Tally script when the component mounts
        const script = document.createElement('script');
        script.src = 'https://tally.so/widgets/embed.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Clean up the script when the component unmounts
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        // Trigger Tally to load the form when the popup opens
        if (isOpen && window.Tally) {
            window.Tally.loadEmbeds();
        }

        // Add click event listener to close popup when clicking outside
        const handleOutsideClick = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                closePopup();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen]);

    return (
        <div>
            <button>
                <div onClick={openPopup} className="flex flex-col gap-8 border-dashed border-2 border-gray-300 rounded-lg p-8 w-[22rem] h-[21rem] cursor-pointer hover:border-gray-400">
                    <p className="m-auto text-gray-500">Request a demo for your app</p>
                </div>
            </button>

            {isOpen && (
                <div className="z-30 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div ref={popupRef} className="bg-white p-4 rounded-lg shadow-lg relative w-full max-w-2xl p-10">
                        <p className="text-2xl font-bold text-center mb-4">Request A Demo For your App</p>
                        <iframe
                            data-tally-src="https://tally.so/embed/wg7lQM?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                            loading="lazy"
                            width="100%"
                            height="424"
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DemoAppRequest;
