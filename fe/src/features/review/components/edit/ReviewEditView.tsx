import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMeetup } from '../../../meetup';
import type { MeetupListItem } from '../../../meetup/types/meetupList';
import { PageContainer, PageHeading, EmptyState, ActionLink } from '../../../../shared/ui';
import { reviewEntries } from '../../mocks/reviewEntries';
import ReviewForm from '../ReviewForm';
export default function ReviewEditView() {
  const { meetupId, reviewId } = useParams();
  const [meetup, setMeetup] = useState<MeetupListItem | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getMeetup(Number(meetupId))
      .then((item) => {
        if (isMounted) setMeetup(item);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [meetupId]);

  const review = reviewEntries.find(
    (item) => item.id === Number(reviewId) && item.meetupId === Number(meetupId),
  );

  if (isLoading) return null;
  if (!meetup || !review)
    return (
      <EmptyState
        title="후기를 찾을 수 없습니다."
        description="해당 모임의 후기 목록을 확인해 주세요."
        action={<ActionLink to="/my-journal">나의 항해 일지</ActionLink>}
      />
    );
  return (
    <PageContainer narrow>
      <PageHeading title="후기를 수정합니다." description={meetup.title} />
      <ReviewForm key={`${meetup.id}-${review.id}`} meetupId={meetup.id} review={review} />
    </PageContainer>
  );
}
