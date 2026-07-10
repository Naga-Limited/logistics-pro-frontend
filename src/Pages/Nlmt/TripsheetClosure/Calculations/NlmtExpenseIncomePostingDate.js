export default function NlmtExpenseIncomePostingDate() {
    let min_date = ''
    let max_date = ''


    const getDateXDaysAgo = (numOfDays, date = new Date()) => {
        const daysAgo = new Date(date.getTime());

        daysAgo.setDate(date.getDate() - numOfDays);

        let needed_date = new Date(daysAgo).toISOString().slice(0, 10)

        return needed_date;
    }

    const getDateXDaysBefore = (numOfDays, date = new Date()) => {
        const daysAgo = new Date(date.getTime());

        daysAgo.setDate(date.getDate() + numOfDays);

        let needed_date = new Date(daysAgo).toISOString().slice(0, 10)

        return needed_date;
    }

    let today = new Date().toISOString().slice(0, 10)

    console.log(today,'today')

    const date = new Date(today);

    /*==========================(Updated Time Source Code Start)============================================*/
    var updated_date = new Date();
    var isoDateTime = new Date(updated_date.getTime() - (updated_date.getTimezoneOffset() * 60000)).toISOString();
    var exact_date = isoDateTime.slice(0, 10)
    const todayDate = new Date(exact_date);
    min_date = getDateXDaysAgo(3, todayDate)
    max_date = exact_date
  /*==========================(Updated Time Source Code End)=============================================*/

    let date_component = {}

    date_component.min_date = min_date
    date_component.max_date = max_date

    console.log(date_component,'date_component')

    return date_component
}
