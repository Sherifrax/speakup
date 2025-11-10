import { apiService } from "../apiService";
import { speakupUrls } from "../../enum/api/speakup.enum";
import { baseModule } from "../../enum/api/basemodules.enum";
import { sanitizeNumber, sanitizeString } from "../../utils/sanitizers";
import { PaginationParams } from "../../features/common/types/commonTypes";
import { SpeakUpItem } from "../../features/speakup/types/speakupTypes";
import { SpeakUpSearchParams } from "../../features/speakup/types/speakupTypes";

export const speakupManageSearch = apiService.injectEndpoints({
  endpoints: (builder) => ({
    searchSpeakup: builder.mutation<
      SpeakUpItem[],
      { search: SpeakUpSearchParams; pagination: PaginationParams }
    >({
      query: ({ search, pagination }) => {
        const postFilters: SpeakUpSearchParams = {
          IsAnonymous: sanitizeNumber(search.IsAnonymous),
          compID: sanitizeNumber(search.compID),
          StatusID: sanitizeNumber(search.StatusID),
          TypeID: sanitizeNumber(search.TypeID),
          CommonSearchString: sanitizeString(search.CommonSearchString),
        };
        const params = {
          page: pagination.page ?? 1,
          size: pagination.size ?? 10,
          sortBy: pagination.sortBy ?? "ID",
          sortOrder: pagination.sortOrder ?? "asc",
        };

        const body = { params: postFilters };

        return {
          url: baseModule.speakup + speakupUrls.SearchManage,
          method: "POST",
          params,
          body,
        };
      },
    }),
  }),
});

export const { useSearchSpeakupMutation } = speakupManageSearch;
