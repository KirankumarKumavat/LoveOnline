import { icons } from "../assets"
import { commonText } from "../common"

export const height = [

    "4'0\      (122cm)",
    "4'1\      (124cm)",
    "4'2\      (127cm)",
    "4'3\      (130cm)",
    "4'4\      (132cm)",
    "4'5\      (135cm)",
    "4'6\      (137cm)",
    "4'7\      (140cm)",
    "4'8\      (142cm)",
    "4'9\      (145cm)",
    "4'10      (147cm)",
    "4'11      (150cm)",
    "5'0\      (152cm)",
    "5'1\      (155cm)",
    "5'2\      (157cm)",
    "5'3\      (160cm)",
    "5'4\      (163cm)",
    "5'5\      (165cm)",
    "5'6\      (168cm)",
    "5'7\      (170cm)",
    "5'8\      (173cm)",
    "5'9\      (175cm)",
    "5'10      (178cm)",
    "5'11      (180cm)",
    "6'0\      (183cm)",
    "6'1\      (185cm)",
    "6'2\      (188cm)",
    "6'3\      (190cm)",
    "6'4\      (193cm)",
    "6'5\      (196cm)",
    "6'6\      (198cm)",
    "6'7\      (201cm)",
    "6'8\      (203cm)",
    "6'9\      (206cm)",
    "6'10      (208cm)",
    "6'11      (211cm)",
    "7'0\      (213cm)",
]

export const heightInInches = [
    "4'0",
    "4'1",
    "4'2",
    "4'3",
    "4'4",
    "4'5",
    "4'6",
    "4'7",
    "4'8",
    "4'9",
    "4'10",
    "4'1",
    "5'0",
    "5'1",
    "5'2",
    "5'3",
    "5'4",
    "5'5",
    "5'6",
    "5'7",
    "5'8",
    "5'9",
    "5'10",
    "5'11",
    "6'0",
    "6'1",
    "6'2",
    "6'3",
    "6'4",
    "6'5",
    "6'6",
    "6'7",
    "6'8",
    "6'9",
    "6'10",
    "6'11",
    "7'0",
    "7'1",
    "7'2",
    "7'3",
    "7'4",
    "7'5",
    "7'6",
]

export const answers = [
    { title: 'Select a prompt', answersTitle: 'Write an answer' },
    { title: 'Select a prompt', answersTitle: 'Write an answer' },
    { title: 'Select a prompt', answersTitle: 'Write an answer' },
    { title: 'Select a prompt', answersTitle: 'Write an answer' },
    { title: 'Select a prompt', answersTitle: 'Write an answer' },
]

export const profileItems = [
    {
        title: 'Edit Profile',
        icon: icons.manUser,
        route: commonText.editProfileRoute,
    },
    {
        title: 'Filters & Preferences',
        icon: icons.filter,
        route: commonText.filterRoute,
    },
    {
        title: 'Settings',
        icon: icons.setting,
        route: commonText.settingsScreenRoute,
    },
]

// Somali, Mixed Somali, Non-Somali 
export const sectArray = [
    {
        id: 0,
        title: commonText.hinduism
    },
    {
        id: 1,
        title: commonText.buddhism
    },
    {
        id: 2,
        title: commonText.Jainism
    },
    {
        id: 3,
        title: commonText.sikhism
    }, {
        id: 4,
        title: commonText.islam
    }, {
        id: 5,
        title: commonText.judaism
    },
    {
        id: 6,
        title: commonText.christianity
    },
    {
        id: 7,
        title: commonText.otherreligions
    },
]

export const spiritualityArray = [
    {
        id: 1,
        title: commonText.veryReligious,
    },
    {
        id: 2,
        title: commonText.religious,
    },
    {
        id: 3,
        title: commonText.notveryreligious,
    },
    {
        id: 4,
        title: commonText.preferNotSay,
    }
]

export const prayArray = [
    { id: 1, title: commonText.alwayspray, },
    { id: 2, title: commonText.usuallypray, },
    { id: 3, title: commonText.sometimespray, },
    { id: 4, title: commonText.liketostart, }
]

export const maritalStatus = [

    {
        title: commonText.single,
        id: 1,
    },
    {
        title: commonText.divorced,
        id: 2
    },
    {
        title: commonText.widowed,
        id: 3,
    }
]

export const marriageGoals = [
    {
        title: commonText.marriageOption1,
    },
    {
        title: commonText.marriageOption2,
    },
    {
        title: commonText.marriageOption3,
    },
    {
        title: commonText.marriageOption4,
    },

]

export const account = [
    {
        title: 'Change Password',
        route: commonText.changePasswordRoute,
        isChangePassword: true,
    },
    {
        title: 'Terms and conditions',
        route: commonText.termsAndPrivacyRoute,
        param: { terms: true }
    },
    {
        title: 'Privacy Policy',
        route: commonText.termsAndPrivacyRoute,
        param: { policy: true }
    },

]

export const accountSocial = [
    {
        title: 'Terms and conditions',
        route: commonText.termsAndPrivacyRoute,
        param: { terms: true }
    },
    {
        title: 'Privacy Policy',
        route: commonText.termsAndPrivacyRoute,
        param: { policy: true }
    },
]

export const notifications = [
    {
        title: 'When there is a match',
        id: 0,
    },
    {
        title: 'When someone sends a message',
        id: 1,
    },
    {
        title: 'When someone likes your profile',
        id: 2,
    },
]