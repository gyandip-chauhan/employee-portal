export const API_LOGIN = '/login';
export const API_SIGNUP = '/signup';
export const API_LOGOUT = '/logout';
export const API_CHANGE_PASSWORD = '/change_password';
export const API_FORGOT_PASSWORD = '/forgot_password';
export const API_RESET_PASSWORD = '/reset_password';

export const API_ATTENDANCES = '/attendances';
export const API_REMOTE_CLOCK_IN = '/remote_clock_in';
export const API_REMOTE_CLOCK_OUT = '/remote_clock_out';

export const CABLE_URL = 'ws://192.168.30.26:3000/cable'
export const API_SEND_MESSAGE = '/messages'
export const API_ALL_MESSAGES = '/messages'

export const API_PDF_ADD_TEXT = '/pdfs/add_text';
export const API_PDF_ADD_IMAGE = '/pdfs/add_image';
export const API_PDF_DELETE_PAGE = '/pdfs/delete_page';
export const API_PDF_ADD_ANNOTATION = '/pdfs/add_annotation';
export const API_PDF_ADD_FORM_FIELD = '/pdfs/add_form_field';
export const API_PDF_ADD_WATERMARK = '/pdfs/add_watermark';
export const API_PDF_ENCRYPT = '/pdfs/encrypt';
export const API_PDF_MERGE = '/pdfs/merge';
export const API_PDF_SPLIT = '/pdfs/split';

export const API_TEAM_SUMMARY = (id) => `/teams/${id}`

// export const API_SHOWTIMES = (movieId: string, selectedDate: string, selectedPriceRange: string, selectedTheater: string, selectedScreen: string) => `/showtimes?movie_id=${movieId}&date=${selectedDate}&price_range=${selectedPriceRange}&theater_id=${selectedTheater}&screen_id=${selectedScreen}`;
// export const API_SHOWTIME_DETAILS = (id: string, theater_id: string, screen_id: string, movie_id: string) => `/showtimes/${id}?theater_id=${theater_id}&screen_id=${screen_id}&movie_id=${movie_id}`;

// export const API_BOOK_NOW = (showtimeId: string) => `/showtimes/${showtimeId}/book_now`;
// export const API_INVOICE = (id: string, showtimeId: string) => `/bookings/${id}/invoice?showtime_id=${showtimeId}`;

// export const API_STRIPE_INTENT = '/stripe_payments';
// export const API_STRIPE_CONFIRM = '/stripe_payments/confirm';

// export const API_BOOKINGS = '/bookings';
// export const API_CANCEL_BOOKING = (id: number) => `/bookings/${id}/cancel`;

// export const API_MOVIES = '/movies';
// export const API_MOVIE_DETAILS = (id: string) => `/movies/${id}`;

// export const API_NOTIFICATIONS = '/notifications';
// export const API_NOTIFICATIONS_MARK_ALL_AS_READ = (notificationId: string) => `notifications/mark_as_read?notification_id=${notificationId}`;