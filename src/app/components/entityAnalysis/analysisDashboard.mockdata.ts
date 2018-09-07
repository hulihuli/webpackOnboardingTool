import { ExperimentDto } from "../../core/experimentDto"
import { AnalysisType } from "../../core/enums"

export let experimentDtos: ExperimentDto[] = [
    new ExperimentDto(
        1,
        "entitySpace1",
        AnalysisType.EntitySpace,
        "jixge" ,
        "jixge" ,
        "xingfeed",
        "",
        "xingFeedview",
        "",
        "Satori",
        "Sources"
    ),
    new ExperimentDto(
        2,
        "entityView",
        AnalysisType.EntitySpace,
        "jixge" ,
        "jixge" ,
        "xingfeed",
        "",
        "xingFeedview",
        "",
        "Satori",
        "Sources"
    ),
    new ExperimentDto(
        3,
        "graph",
        AnalysisType.EntityGraph,
        "jixge" ,
        "jixge" ,
        "xingfeed",
        "",
        "xingFeedview",
        "",
        "Satori",
        "Sources"
    ),
]