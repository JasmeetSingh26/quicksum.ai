"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useSummary } from "@/contexts/SummaryContext";
import { useRouter } from "next/navigation";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon"; // Corrected import for TrashIcon
import ProgressLoader from "@/components/ProgressLoader";

const SummaryDialog = ({ isOpen, closeDialog }) => {
  const { createSummary } = useSummary();
  const router = useRouter();

  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [summaryLength, setSummaryLength] = useState(500);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setText("");
      setSummaryLength(500);
      setLoading(false);
    }
  }, [isOpen]);

  const handleFileChange = useCallback((selectedFile) => {
    setFile(selectedFile);
    setText("");
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!file && !text) {
      toast.error("Please provide a file or text");
      return;
    }

    const formData = new FormData();
    if (file) formData.append("file", file);
    if (text) formData.append("text", text);
    formData.append("summaryLength", summaryLength);

    try {
      setLoading(true);
      const id = await createSummary(formData);
      if (!id) throw new Error("Error creating summary");

      toast.success("Summary created successfully");
      closeDialog();
      router.push(`/dashboard/summary/${id}`);
    } catch (error) {
      console.error("Error creating summary:", error);
      toast.error("Failed to create summary. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [file, text, summaryLength, createSummary, closeDialog, router]);

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeDialog}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gray-700 bg-opacity-30 backdrop-blur-lg p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium text-white flex justify-between items-center">
                  Create New Summary
                  <button
                    onClick={closeDialog}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </Dialog.Title>

                <div className="mt-4">
                  <FileInput file={file} setFile={handleFileChange} />
                  <TextInput text={text} setText={setText} disabled={!!file} />
                  {!loading && (
                    <SummaryLengthSlider
                      summaryLength={summaryLength}
                      setSummaryLength={setSummaryLength}
                    />
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  {loading ? (
                    <ProgressLoader />
                  ) : (
                    <button
                      type="button"
                      className="bg-blue-600 px-4 py-2 text-sm text-white rounded-md hover:bg-blue-700"
                      onClick={handleSubmit}
                    >
                      Create Summary
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default React.memo(SummaryDialog);

const FileInput = ({ file, setFile }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      setFile(e.dataTransfer.files[0]);
    },
    [setFile]
  );

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="hidden"
        id="fileInput"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <label htmlFor="fileInput" className="cursor-pointer">
        {file ? (
          <div className="flex items-center justify-center">
            <p className="mr-2 text-white">{file.name}</p>
            <button
              className="bg-red-500 p-1 rounded-full"
              onClick={() => setFile(null)}
            >
              <TrashIcon className="h-4 w-4 text-white" />
            </button>
          </div>
        ) : (
          <p className="text-lg text-white">
            Drag & drop a file here, or click to select
          </p>
        )}
      </label>
    </div>
  );
};

const TextInput = ({ text, setText, disabled }) => (
  <textarea
    value={text}
    onChange={(e) => setText(e.target.value)}
    placeholder="Or enter text here"
    className="w-full p-2 border rounded resize-none bg-transparent text-white"
    rows="6"
    disabled={disabled}
  />
);

const SummaryLengthSlider = ({ summaryLength, setSummaryLength }) => (
  <div className="mt-4">
    <label className="block mb-2 text-white font-thin">
      Summary Length: {summaryLength} words
    </label>
    <input
      type="range"
      min="0"
      max="2"
      value={[300, 500, 800].indexOf(summaryLength)}
      onChange={(e) => setSummaryLength([300, 500, 800][e.target.value])}
      className="w-full"
    />
  </div>
);
