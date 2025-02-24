
interface configProps {
    reservation: {
        tableSizeMax: number,
        tableSizeMin: number,
    }
    api:{
        makeBookingURL: string,
        getBookingInfoURL: string,
        cancelBookingURL: string
    }
}

export const config:configProps = {
    reservation:{
        tableSizeMax: 10,
        tableSizeMin: 1
    },
    api:{
        makeBookingURL: 'http://localhost/api/making-booking',
        getBookingInfoURL: 'http://localhost/api/get-booking-info',
        cancelBookingURL: 'http://localhost/api/cancel-booking',
    }
}