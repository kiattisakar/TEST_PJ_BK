const fomattedDate =(req, res) => {
    const currentTimezoneOffset = -7 * 60
    const currentTimestamp = Date.now()
    const adjustedTimestamp = currentTimestamp - (currentTimezoneOffset * 60 * 1000);
    const dateInGMTPlus7 = new Date(adjustedTimestamp);
    const day = dateInGMTPlus7.getUTCDate().toString().padStart(2, '0');
    const month = (dateInGMTPlus7.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = dateInGMTPlus7.getUTCFullYear();
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
};

const fomattedTime =(req, res) => {
    const currentTimezoneOffset = -7 * 60;
    const currentTimestamp = Date.now();
    const adjustedTimestamp = currentTimestamp - (currentTimezoneOffset * 60 * 1000);
    const dateInGMTPlus7 = new Date(adjustedTimestamp);
    const hours = dateInGMTPlus7.getUTCHours().toString().padStart(2, '0');
    const minutes = dateInGMTPlus7.getUTCMinutes().toString().padStart(2, '0');
    const seconds = dateInGMTPlus7.getUTCSeconds().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    return formattedTime;
};

module.exports = {
    fomattedDate,
    fomattedTime
};
