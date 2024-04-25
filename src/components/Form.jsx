import React, { useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import toast, { Toaster } from "react-hot-toast";
import { db, storage } from "../firebase";
import { useForm } from "@formspree/react";

const Form = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const serviceId = "service_qh8hceo";
  const templateId = "template_85r248p";
  const publicKey = "JybPW_QVCGftr4Eh8";

  const [formData, setFormData] = useState({
    companyname: "",
    email: "",
    phonenumber: "",
    message: "",
    file: "",
    createdAt: Timestamp.now().toDate(),
  });

  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0],
    });
  };

  const handleUpload = (e) => {
    e.preventDefault();

    if (
      !formData.companyname ||
      !formData.message ||
      !formData.file ||
      !formData.email ||
      !formData.phonenumber
    ) {
      setError("Missing input fields !");
      return;
    }

    setLoading(true);
    const storageRef = ref(
      storage,
      `/pdf-files/${Date.now()}${formData.file.name}`
    );

    const uploadImage = uploadBytesResumable(storageRef, formData.file);

    uploadImage.on(
      "state_changed",
      (snapshot) => {
        const progressPercent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progressPercent);
      },
      (err) => {
        console.log(err);
      },
      () => {
        setFormData({
          companyname: "",
          email: "",
          phonenumber: "",
          message: "",
          file: "",
        });

        getDownloadURL(uploadImage.snapshot.ref).then((url) => {
          const articleRef = collection(db, "sample-form-content");
          addDoc(articleRef, {
            companyname: formData.companyname,
            email: formData.email,
            phonenumber: formData.phonenumber,
            message: formData.message,
            file: url,
            createdAt: Timestamp.now().toDate(),
          })
            .then(() => {
              toast.success("Form submitted successfully");
              setSuccess("We will contact you soon !");
              setProgress(0);
              setLoading(false);
            })
            .catch((err) => {
              toast.error(err);
            });
        });
      }
    );
  };

  return (
    <>
      <form className="w-[400px] p-5 rounded-2xl flex flex-col gap-7 bg-white">
        <div className="flex flex-col gap-1">
          <label htmlFor="company" className="text-base font-semibold">
            Company name*
          </label>
          <input
            type="text"
            name="companyname"
            placeholder="Company Name"
            value={formData.companyname}
            onChange={(e) => handleChange(e)}
            className="w-full h-[50px] outline outline-transparent border border-gray-400 p-4 rounded-xl text-[18px]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="company" className="text-base font-semibold">
            Email address*
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleChange(e)}
            placeholder="Email address"
            className="w-full h-[50px] outline outline-transparent border border-gray-400 p-4 rounded-xl text-[18px]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="phonenumber" className="text-base font-semibold">
            Phone*
          </label>
          <input
            type="text"
            name="phonenumber"
            value={formData.phonenumber}
            onChange={(e) => handleChange(e)}
            placeholder="Phone number"
            className="w-full h-[50px] outline outline-transparent border border-gray-400 p-4 rounded-xl text-[18px]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="message" className="text-base font-semibold">
            Message*
          </label>
          <textarea
            name="message"
            id="message"
            value={formData.message}
            onChange={(e) => handleChange(e)}
            className="w-full h-[150px] outline outline-transparent border border-gray-400 p-4 rounded-xl text-[18px]"
          ></textarea>
        </div>
        <div className="flex flex-col gap-1">
          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="file_input"
          >
            Upload file*
          </label>
          <input
            className="block w-full p-4 text-sm text-gray-900 border border-black rounded-xl cursor-pointer"
            id="file_input"
            accept="application/pdf, application/vnd.ms-excel"
            type="file"
            onChange={(e) => handleImageChange(e)}
          />

          {progress === 0 ? null : (
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>
        {error && (
          <div>
            <span className="text-red-500 font-semibold text-base w-full rounded-xl">
              {error}
            </span>
          </div>
        )}
        {success && (
          <div>
            <span className="text-green-600 font-semibold text-base w-full rounded-xl">
              {success}
            </span>
          </div>
        )}
        <div className="flex">
          {loading ? (
            <div
              className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          ) : (
            <button
              onClick={handleUpload}
              className="p-3 w-full rounded-2xl text-white bg-black cursor-pointer"
            >
              Submit to request
            </button>
          )}
        </div>
      </form>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default Form;
