import { Err, Ok, type Result } from "../result.js";

export function parseDate(dateString: string): Result<Date> {
    if (!new RegExp(/^\d{4}-\d\d?-\d\d?$/).test(dateString)) return Err("Invalid date format, expected YYYY-MM-DD");

    const date = new Date(dateString);
    return Ok(date);
}

export function unixToDate(timestamp: number): Date {
    return new Date(timestamp * 1000);
}
