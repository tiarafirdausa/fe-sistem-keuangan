
const formatNumberWithSuffix = (number) => {
    if (isNaN(parseFloat(number))) { // Handle non-numeric values gracefully
        return number;
    }

    const absNumber = Math.abs(parseFloat(number));

    if (absNumber >= 1000000000) {
        return (number / 1000000000).toFixed(1) + 'B';
    }
    if (absNumber >= 1000000) {
        return (number / 1000000).toFixed(1) + 'M';
    }
    if (absNumber >= 1000) {
        return (number / 1000).toFixed(1) + 'K';
    }
    return number.toString();
};

const AbbreviateNumber = ({ value }) => {
    if (value === null || value === undefined) {
        return 0; // Or return whatever default value you prefer
    }
    
    // Ensure the value is a number before passing it to the formatter
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;

    return <>{formatNumberWithSuffix(numericValue)}</>;
};

export default AbbreviateNumber;