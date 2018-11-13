import React from "react";
import * as Utils from "./utils/index";
import { STUDY_ACTIVE, STUDY_COMPLETE } from "../../utils/SynapseConstants";

type StudyState = {
    showMore: boolean
    hasCreatedIndex: boolean
};

type StudyProps = {
    data?: any
    schema?: any
};

export default class Study extends React.Component<StudyProps, StudyState> {

    constructor(props: StudyProps) {
        super(props);
        this.state = {
            showMore: false,
            hasCreatedIndex: false
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event: React.SyntheticEvent) {
        this.setState({
            showMore: !this.state.showMore
        });
    }

    render() {
        const { data, schema } = this.props;
        const projectName = data[schema.projectName];
        const projectLeads = data[schema.projectLeads] && data[schema.projectLeads].split(";").join(" / ");
        let summary = data[schema.summary];
        const diseaseFocus = data[schema.diseaseFocus];
        const tumorType = data[schema.tumorType];
        const projectStatus = data[schema.projectStatus];
        const fundingAgency = data[schema.fundingAgency];
        const dataStatus = data[schema.dataStatus];
        const summarySource = data[schema.summarySource];
        // const institutions = data[schema.institutions]
        const values = [["STATUS", projectStatus], ["FUNDER", fundingAgency], ["DATA", dataStatus], ["PUBLICATION", "NONE"]];
        let chips = [tumorType, diseaseFocus];
        return (
            <div className="SRC-portalCard SRC-typeStudy SRC-layoutLandscape SRC-showMetadata">
                <div className="SRC-cardThumbnail">
                    <Utils.Icon type={projectStatus === "Active" ? STUDY_ACTIVE : STUDY_COMPLETE}> </Utils.Icon>
                    <div>{projectStatus}</div>
                </div>
                <div className="SRC-cardContent">
                    <div className="SRC-type">Study</div>
                    <div className="SRC-title">
                        {" "}
                        <h3>
                            {" "}
                            <a target="_blank" href={summarySource}>
                                {projectName}
                            </a>{" "}
                        </h3>{" "}
                    </div>
                    <div className="SRC-author">{projectLeads}</div>
                    <span className="SRC-font-size-base">
                        <Utils.ShowMore onClick={this.handleClick} summary={summary} />
                    </span>
                    <div className="SRC-cardAnnotations">
                        <Utils.ChipContainer chips={chips} />
                    </div>
                </div>
                <Utils.CardFooter values={values} />
            </div>
        );
    }
}