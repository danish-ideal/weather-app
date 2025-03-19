

export interface Country {
    flags: Flag,
    name: string,
    latitude: number,
    longitude: number,
    userId: string
}
export interface CountryWithWeather extends Country {
    temperature: number,
    formatedTime: string,
    windspeed: string,
    is_day: number
}


interface Flag {
    svg: string,
    png: string,
    alt: string
}
