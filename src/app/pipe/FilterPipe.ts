import { Pipe, PipeTransform } from "@angular/core";
import { BaseComponent } from "../components/common/base.component";

@Pipe({
	name: "filter",
	pure: false
})
export class FilterPipe extends BaseComponent implements PipeTransform {
    public i = 0;
	traverse(item: any, query: string): boolean {
        this.logger.info(item);
        if (this.i > 100) {
            return true;
        }

        if (typeof item !== "object") {
            return item.toString().indexOf(query) !== -1;
        }

		for (var property in item) {
            this.i++;
			//this.logger.info(item[property]);
			if (Array.isArray(item[property])) {
                this.logger.info("Array", this.i, item[property]);
                // item[property].forEach((t: any) => {
                //     this.logger.info("t", t);
                //     if (this.traverse(t, query)) {
                //         return true;
                //     }
                // });
                var len = item[property].length;
				for(var i = 0; i < len; i++) {
                    if (this.traverse(item[property][i], query)) {
                        return true;
                    }
                }
			} else {
                this.logger.info("NotArray", this.i, item[property], typeof item[property]);
                
				if (typeof item[property] !== "object") {
                    this.logger.info("aa", item[property].toString());
                    this.logger.info("bb", item[property].toString().indexOf(query));
                    
                    if (item[property].toString().indexOf(query) !== -1) {
                        this.logger.info("true result");
                        return true;                        
                    }
                }else {
                    this.logger.info("ss", item[property]);
                    return this.traverse(item[property], query);
                }
			}
		}

		return false;
	}

	transform(items: any[], query: string): any {
		if (!items || !query) {
			return items;
		}

        this.logger.info(query);
		// filter items array, items which match and return true will be
		// kept, false will be filtered out
		return items.filter(item => this.traverse(item, query));

		// return items.filter(item => {
		//     this.traverse(item, query);

		//     // for (var property in item) {
		//     //     if (Array.isArray(item[property])) {
		//     //         return item[property].some((e: string) => e === query) !== undefined;
		//     //     } else {
		//     //         return item[property].indexOf(query) !== -1;
		//     //     }
		//     // }
		// });
	}
}
