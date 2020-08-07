export function roleSelector(rating) {
    let roles = [];
    switch (rating) {
        case 0:
        break;
        case 1:
            role = [1];
         break;
        case 2:
            role = [1,2];
        break;
        case 3:
            role = [1,2,3];
        break;
        case 4:
            role = [1,2,3,4]:
        break;
        default:
            role = [];
        break;
    }
    return rating;
}