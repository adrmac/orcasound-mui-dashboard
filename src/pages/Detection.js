import React from "react";
import { useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

export default function Detection() {
    const [results, id] = useOutletContext();
    const result = results.find(el => el.id === id);
    return (
        <div>This is the page for detection {id} category {result.category}</div>
    )
}