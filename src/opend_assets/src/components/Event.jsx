import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { opend } from "../../../declarations/opend";
import FetchEventsButton from "./FetchEventsButton"; // Assuming this is the correct path to the FetchEventsButton component

function Event() {
    const { register, handleSubmit, reset } = useForm();
    const [loaderHidden, setLoaderHidden] = useState(true);
    const [buttonText, setButtonText] = useState("Create Event");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackType, setFeedbackType] = useState(""); // "success" or "error"

    async function onSubmit(data) {
        setIsSubmitting(true);
        setLoaderHidden(false);
        setButtonText("Creating...");
        setFeedbackMessage("");
        
        console.log("Form Data:", data);
        console.log(data.total_ticket);
        console.log(typeof(data.total_ticket));
        console.log("on submit clicked");

        try {
            const result = await opend.createEvent(
                data.title, 
                data.description, 
                data.location, 
                data.date, 
                data.time, 
                Number(data.total_ticket), 
                Number(data.price)
            );
            
            console.log("Event created successfully:", result);
            
            // Check if the result indicates success
            if (result === "success" || result.includes("success")) {
                setFeedbackMessage("Event created successfully! 🎉");
                setFeedbackType("success");
                setButtonText("Event Created ✓");
                
                // Reset form
                reset();
                
                // Reset button text after 3 seconds
                setTimeout(() => {
                    setButtonText("Create Event");
                    setFeedbackMessage("");
                    setFeedbackType("");
                }, 3000);
            } else {
                setFeedbackMessage("Failed to create event. Please try again.");
                setFeedbackType("error");
                setButtonText("Create Event");
            }
            
        } catch (error) {
            console.error("Error creating event:", error);
            setFeedbackMessage("Failed to create event. Please try again.");
            setFeedbackType("error");
            setButtonText("Create Event");
        } finally {
            setLoaderHidden(true);
            setIsSubmitting(false);
        }
    }

    return (
        <div className="minter-container">
            <div hidden={loaderHidden} className="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            
            <h3 className="makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
                Create Event
            </h3>
            
            {/* Feedback Message */}
            {feedbackMessage && (
                <div 
                    className={`feedback-message ${feedbackType}`}
                    style={{
                        padding: "10px",
                        marginBottom: "20px",
                        borderRadius: "5px",
                        backgroundColor: feedbackType === "success" ? "#d4edda" : "#f8d7da",
                        color: feedbackType === "success" ? "#155724" : "#721c24",
                        border: `1px solid ${feedbackType === "success" ? "#c3e6cb" : "#f5c6cb"}`,
                        textAlign: "center"
                    }}
                >
                    {feedbackMessage}
                </div>
            )}
            
            <form className="makeStyles-form-109" noValidate="" autoComplete="off">
                <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
                    Event Name
                </h6>
                <div className="form-FormControl-root form-TextField-root form-FormControl-marginNormal form-FormControl-fullWidth">
                    <div className="form-InputBase-root form-OutlinedInput-root form-InputBase-fullWidth form-InputBase-formControl">
                        <input
                            {...register("title", { required: true })}
                            placeholder="e.g. CryptoDunks Events"
                            type="text"
                            className="form-InputBase-input form-OutlinedInput-input"
                            disabled={isSubmitting}
                        />
                        <fieldset className="PrivateNotchedOutline-root-60 form-OutlinedInput-notchedOutline"></fieldset>
                    </div>
                </div>
                
                <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
                    Event Description
                </h6>
                <div className="form-FormControl-root form-TextField-root form-FormControl-marginNormal form-FormControl-fullWidth">
                    <div className="form-InputBase-root form-OutlinedInput-root form-InputBase-fullWidth form-InputBase-formControl">
                        <input
                            {...register("description", { required: true })}
                            placeholder="e.g. CryptoDunks is a NFT summit event."
                            type="text"
                            className="form-InputBase-input form-OutlinedInput-input"
                            disabled={isSubmitting}
                        />
                        <fieldset className="PrivateNotchedOutline-root-60 form-OutlinedInput-notchedOutline"></fieldset>
                    </div>
                </div>
                
                <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
                    Event Location
                </h6>
                <div className="form-FormControl-root form-TextField-root form-FormControl-marginNormal form-FormControl-fullWidth">
                    <div className="form-InputBase-root form-OutlinedInput-root form-InputBase-fullWidth form-InputBase-formControl">
                        <input
                            {...register("location", { required: true })}
                            placeholder="e.g. No 1 Abc street"
                            type="text"
                            className="form-InputBase-input form-OutlinedInput-input"
                            disabled={isSubmitting}
                        />
                        <fieldset className="PrivateNotchedOutline-root-60 form-OutlinedInput-notchedOutline"></fieldset>
                    </div>
                </div>
                
                <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
                    Event Date
                </h6>
                <div className="form-FormControl-root form-TextField-root form-FormControl-marginNormal form-FormControl-fullWidth">
                    <div className="form-InputBase-root form-OutlinedInput-root form-InputBase-fullWidth form-InputBase-formControl">
                        <input
                            {...register("date", { required: true })}
                            placeholder="Select date"
                            type="date"
                            className="form-InputBase-input form-OutlinedInput-input"
                            disabled={isSubmitting}
                        />
                        <fieldset className="PrivateNotchedOutline-root-60 form-OutlinedInput-notchedOutline"></fieldset>
                    </div>
                </div>
                
                <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
                    Event Time
                </h6>
                <div className="form-FormControl-root form-TextField-root form-FormControl-marginNormal form-FormControl-fullWidth">
                    <div className="form-InputBase-root form-OutlinedInput-root form-InputBase-fullWidth form-InputBase-formControl">
                        <input
                            {...register("time", { required: true })}
                            placeholder="Select time"
                            type="time"
                            className="form-InputBase-input form-OutlinedInput-input"
                            disabled={isSubmitting}
                        />
                        <fieldset className="PrivateNotchedOutline-root-60 form-OutlinedInput-notchedOutline"></fieldset>
                    </div>
                </div>
                
                <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
                    Total Tickets
                </h6>
                <div className="form-FormControl-root form-TextField-root form-FormControl-marginNormal form-FormControl-fullWidth">
                    <div className="form-InputBase-root form-OutlinedInput-root form-InputBase-fullWidth form-InputBase-formControl">
                        <input
                            {...register("total_ticket", { required: true, min: 1 })}
                            placeholder="e.g. 100"
                            type="number"
                            className="form-InputBase-input form-OutlinedInput-input"
                            disabled={isSubmitting}
                        />
                        <fieldset className="PrivateNotchedOutline-root-60 form-OutlinedInput-notchedOutline"></fieldset>
                    </div>
                </div>
                
                <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
                    Ticket Price (ICP)
                </h6>
                <div className="form-FormControl-root form-TextField-root form-FormControl-marginNormal form-FormControl-fullWidth">
                    <div className="form-InputBase-root form-OutlinedInput-root form-InputBase-fullWidth form-InputBase-formControl">
                        <input
                            {...register("price", { required: true, min: 0 })}
                            placeholder="e.g. 10"
                            type="number"
                            step="0.01"
                            className="form-InputBase-input form-OutlinedInput-input"
                            disabled={isSubmitting}
                        />
                        <fieldset className="PrivateNotchedOutline-root-60 form-OutlinedInput-notchedOutline"></fieldset>
                    </div>
                </div>
                
                <div 
                    className={`form-ButtonBase-root form-Chip-root makeStyles-chipBlue-108 form-Chip-clickable ${isSubmitting ? 'disabled' : ''}`}
                    style={{
                        opacity: isSubmitting ? 0.6 : 1,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        backgroundColor: 
                            buttonText.includes("Created") ? "#28a745" : 
                            buttonText.includes("Creating") ? "#6c757d" : "",
                        transition: "all 0.3s ease"
                    }}
                >
                    <span 
                        onClick={isSubmitting ? undefined : handleSubmit(onSubmit)} 
                        className="form-Chip-label"
                    >
                        {buttonText}
                    </span>
                </div>
            </form>
            <FetchEventsButton />
        </div>
    );
}

export default Event;