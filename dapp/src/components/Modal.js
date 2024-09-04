import React from 'react';

function Modal({ isOpen, setIsOpen, children }) {
    const handleCloseModal = () => {
        setIsOpen(false);
    };

    return (
        <>
            {isOpen && (
                <div className="modal">
                    <div id="popup-modal" tabIndex="-1" className="fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full flex items-center justify-center bg-black bg-opacity-75">
                        <div className="relative w-full h-full max-w-xl md:h-auto">
                            <div className="relative bg-white rounded-lg shadow">
                                <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" onClick={handleCloseModal}>
                                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                    <span></span>
                                </button>

                                <div className="p-6 text-center">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Modal
