"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import { Loader2 } from "lucide-react";   // ‹–– tiny spinner icon

function ContactForm() {
  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted]   = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata({ ...formdata, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await axiosInstance.post("/contact", formdata);

      if (res.data.message === "Contact form submitted successfully") {
        toast.success("Message sent successfully!");
        setFormdata({ name: "", email: "", message: "" });
        setSubmitted(true);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to send message. Try again later.");
      console.error("Submit error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full h-auto px-4 py-10 flex justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-[#35590E] mb-6">
          Send us a message
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex flex-col items-center"
        >
          <input
            name="name"
            type="text"
            value={formdata.name}
            onChange={handleChange}
            className="p-2 w-full border border-slate-300 rounded-md"
            placeholder="Your Name"
            required
          />

          <input
            name="email"
            type="email"
            value={formdata.email}
            onChange={handleChange}
            className="p-2 w-full border border-slate-300 rounded-md"
            placeholder="Your Email"
            required
          />

          <textarea
            name="message"
            rows="6"
            value={formdata.message}
            onChange={handleChange}
            className="p-2 w-full border border-slate-300 rounded-md"
            placeholder="Your Message"
            required
          ></textarea>

          <div className="flex flex-col items-center mt-4">
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2 bg-orange-500 text-white font-semibold rounded-md 
                         flex items-center justify-center
                         hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send a message"
              )}
            </button>

            {submitted && (
              <p className="text-xs text-gray-500 mt-4 text-center">
                Thank you for your message! We'll get back to you soon.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactForm;
