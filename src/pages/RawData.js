import React from "react";
import { useOutletContext } from "react-router-dom";

export default function RawData() {
    const [data, setData] = useOutletContext();
    return (
        <pre>{JSON.stringify(data, null, 2)}</pre>
    )
}