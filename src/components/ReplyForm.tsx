import { CustomReplySection } from "./CustomReplySection";
import { SmartReplySection } from "./SmartReplySection";

export const ReplyForm = () => {
  return (
    <div style={{ width: 425 }}>
      <div className="flex flex-col w-full border-opacity-50">
        <SmartReplySection />
        <div className="divider">or</div>
        <CustomReplySection />
      </div>
    </div>
  );
};
