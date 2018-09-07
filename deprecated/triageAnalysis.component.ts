// switchResultPane(event: any) {
	// 	this.logger.info("switch result pane:", event);
	// 	if (this.triageAnalysisAetherJob.state !== JobState.Succeeded) {
	// 		return;
	// 	}

	// 	if (!event) {
	// 		this.getTriageAnalysisResultCount(this.triageAnalysisResultId);
	// 	}
	// }

	// getTriageAnalysisResultCount(resultId: number) {
	// 	this.triageService.getTriageAnalysisResultCount(resultId).subscribe(triageAnalysisResultCount => {
	// 		this.logger.info(triageAnalysisResultCount);
	// 		this.triageAnalysisResultCount = triageAnalysisResultCount;
	// 		this.getValidChurn(triageAnalysisResultCount.debugStreamExistense);
	// 	});
	// }

	// getValidChurn(debugStreamExistense: DebugStreamExistense) {
	// 	this.logger.info(debugStreamExistense);

	// 	for (var debugStream in debugStreamExistense) {
	// 		this.logger.info(debugStream, debugStreamExistense[debugStream]);

	// 		if (debugStreamExistense[debugStream]) {
	// 			this.triageDebugStream = debugStream[0].toUpperCase() + debugStream.slice(1);
	// 			this.logger.info(this.triageDebugStream);
	// 			this.switchChurn();
	// 			break;
	// 		}
	// 	}
    // }
    
    // switchChurn() {
	// 	if (this.triageAnalysisResultId == -1) {
	// 		return;
	// 	}

	// 	switch (this.triageDebugStream) {
	// 		case "ValueChurnCounter": {
	// 			if (!this.triageAnalysisResult.valueChurn) {
	// 				this.getTriageAnalysisResultByChurnType(this.triageAnalysisResultId, "ValueChurnCounter").add(
	// 					() => {
	// 						this.triageAnalysisResult.valueChurn = this.currentChurn;
	// 					}
	// 				);
	// 			} else {
	// 				this.currentChurn = this.triageAnalysisResult.valueChurn;
	// 			}
	// 			this.currentTriageResultCount = this.triageAnalysisResultCount.valueChurnCount;

	// 			//this.logger.info(this.currentChurn);

	// 			break;
	// 		}
	// 		case "PipelineTopEntitiesChurnCounter": {
	// 			if (!this.triageAnalysisResult.pipelineTopEntitiesChurn) {
	// 				this.getTriageAnalysisResultByChurnType(
	// 					this.triageAnalysisResultId,
	// 					"PipelineTopEntitiesChurnCounter"
	// 				).add(() => {
	// 					this.triageAnalysisResult.pipelineTopEntitiesChurn = this.currentChurn;
	// 				});
	// 			} else {
	// 				this.currentChurn = this.triageAnalysisResult.pipelineTopEntitiesChurn;
	// 			}
	// 			this.currentTriageResultCount = this.triageAnalysisResultCount.pipelineTopEntitiesChurnCount;

	// 			//this.logger.info(this.currentChurn);

	// 			break;
	// 		}
	// 		case "PipelineTypeChurnCounter": {
	// 			if (!this.triageAnalysisResult.pipelineTypeChurn) {
	// 				this.getTriageAnalysisResultByChurnType(
	// 					this.triageAnalysisResultId,
	// 					"PipelineTypeChurnCounter"
	// 				).add(() => {
	// 					this.logger.info("switchChurn1", this.currentChurn);

	// 					this.triageAnalysisResult.pipelineTypeChurn = this.currentChurn;
	// 				});
	// 			} else {
	// 				this.currentChurn = this.triageAnalysisResult.pipelineTypeChurn;
	// 			}
	// 			this.currentTriageResultCount = this.triageAnalysisResultCount.pipelineTypeChurnCount;

	// 			//this.logger.info("switchChurn2", this.currentChurn);
	// 			break;
	// 		}
	// 		case "PipelineChurnCounter": {
	// 			if (!this.triageAnalysisResult.pipelineChurn) {
	// 				this.getTriageAnalysisResultByChurnType(this.triageAnalysisResultId, "PipelineChurnCounter").add(
	// 					() => {
	// 						this.triageAnalysisResult.pipelineChurn = this.currentChurn;
	// 					}
	// 				);
	// 			} else {
	// 				this.currentChurn = this.triageAnalysisResult.pipelineChurn;
	// 			}
	// 			this.currentTriageResultCount = this.triageAnalysisResultCount.pipelineChurnCount;

	// 			//this.logger.info(this.currentChurn);
	// 			break;
	// 		}
	// 		case "PipelineUpdatedEntitiesChurnCounter": {
	// 			if (!this.triageAnalysisResult.pipelineUpdatedEntitesChurn) {
	// 				this.getTriageAnalysisResultByChurnType(
	// 					this.triageAnalysisResultId,
	// 					"PipelineUpdatedEntitiesChurnCounter"
	// 				).add(() => {
	// 					this.triageAnalysisResult.pipelineUpdatedEntitesChurn = this.currentChurn;
	// 				});
	// 			} else {
	// 				this.currentChurn = this.triageAnalysisResult.pipelineUpdatedEntitesChurn;
	// 			}
	// 			this.currentTriageResultCount = this.triageAnalysisResultCount.pipelineUpdatedEntitiesChurnCount;

	// 			//this.logger.info(this.currentChurn);
	// 			break;
	// 		}
	// 		case "UpdatedEntitiesChurnCounter": {
	// 			if (!this.triageAnalysisResult.updatedEntitesChurn) {
	// 				this.getTriageAnalysisResultByChurnType(
	// 					this.triageAnalysisResultId,
	// 					"UpdatedEntitiesChurnCounter"
	// 				).add(() => {
	// 					this.triageAnalysisResult.updatedEntitesChurn = this.currentChurn;
	// 				});
	// 				this.currentTriageResultCount = this.triageAnalysisResultCount.updatedEntitiesChurnCount;
	// 			} else {
	// 				this.currentChurn = this.triageAnalysisResult.updatedEntitesChurn;
	// 			}
	// 			this.currentTriageResultCount = this.triageAnalysisResultCount.updatedEntitiesChurnCount;

	// 			break;
	// 		}
	// 	}
	// 	//this.logger.info(this.currentChurn);
	// }


    // getTriageAnalysisResultByChurnType(resultId: number, triageChurnType: string) {
	// 	this.isFetchingAnalysisResult = true;
	// 	return this.triageService
	// 		.getTriageResultByChurnType(resultId, triageChurnType)
	// 		.map(t => this.convertSatoriTimeToGeneralTime(t))
	// 		.subscribe((triageChurn: TriageChurn) => {
	// 			//this.logger.info("triageChurn", triageChurn, triageChurnType);
	// 			this.setCollapseTag(triageChurn);
	// 			//this.logger.info("response1", response);

	// 			this.currentChurn = triageChurn;
	// 			this.isFetchingAnalysisResult = false;
	// 			//this.logger.info("switchChurn0", this.currentChurn);
	// 		});
	// }