import { EntityViewKey } from "./entityView";

export class Constants {

    //triage debug folder stream
    public static readonly streamValueChurnCounter: string = "ValueChurnCounter.ss";
    public static readonly streamPipelineTopEntitiesChurnCounter: string = "PipelineTopEntitiesChurnCounter.ss";
    public static readonly streamPipelineChurnCounter: string = "PipelineChurnCounter.ss";
    public static readonly streamPipelineTypeChurnCounter: string = "PipelineTypeChurnCounter.ss";
    public static readonly streamPipelineUpdatedEntitiesChurnCounterStreamName: string = "PipelineUpdatedEntitiesChurnCounter.ss";


    public static readonly wrapStar = "WrapStar";
    public static readonly streamView: string = "View.Combined.ss";
    public static readonly streamEntitySpace: string = "Fact.Base.ss";
    public static readonly folderDebug: string = "Debug";
    public static readonly loggerName: string = "onboardingToolLogger";
    public static readonly none: string = "none";

    public static readonly weekDays: number = 7;
    public static readonly monthDays: number = 30;
    public static readonly topTen: number = 10;
    public static readonly topFive: number = 5;
    public static readonly oneDayMilliseconds : number = 1000 * 60 * 60 * 24;//1,000 ms * 60 s * 60 mins * 24 hrs = daily million seconds

    public static readonly everyVersionLimit: number = 24;
    public static readonly majorVersionLimit: number = 240;
    public static readonly manualLimit: number = 1020;

    public static readonly everyVersionTimeout: number = 8;
    public static readonly majorVersionTimeout: number = 20;
    public static readonly manualTimeout: number = 30;

    public static readonly EPProdJobServiceUrl: string = "http://entityrepository.binginternal.com/";
    public static readonly commitCommentTips = new Map<string, string>([
        ["SourceChange", "The root cause is source data's change. It's expected."],
        ["PageNotFound", "The root cause is source page's not found. It's expected."],
        ["NormalUpdate", "The root cause is source data's normal update. It's expected."]
    ]);

    public static readonly specificViewsWithUnderline = new Map<string, EntityViewKey>([
        ["LinkedIn_JobPosting_LinkedIn_JobPosting_View", new EntityViewKey("LinkedIn_JobPosting_LinkedIn_JobPosting_View", "LinkedIn_JobPosting", "LinkedIn_JobPosting_View")],
        ["FoodRecipe_Experience_Recipes", new EntityViewKey("FoodRecipe_Experience_Recipes", "FoodRecipe_Experience", "Recipes")],
        ["int-Eventful_Data_Onboarding_FeedEvenfulView", new EntityViewKey("int-Eventful_Data_Onboarding_FeedEvenfulView", "int-Eventful_Data_Onboarding", "FeedEvenfulView")],
        ["musicbrainz_production_musicbrainz", new EntityViewKey("musicbrainz_production_musicbrainz", "musicbrainz_production", "musicbrainz")]
    ])
}