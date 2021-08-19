const createFullName = (fname: string, lname: string): string => {
    let fullName = lname + ', ' +fname

    return fullName
}

export const Utils = {
    createFullName
}