import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMeetup } from '../../../meetup';
import type { MeetupListItem } from '../../../meetup/types/meetupList';
import { PageContainer, PageHeading, EmptyState, ActionLink } from '../../../../shared/ui';
import ReviewForm from '../ReviewForm';
export default function ReviewCreateView() {
  const { meetupId } = useParams();
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

  if (isLoading) return null;
  if (!meetup)
    return (
      <EmptyState
        title="모임을 찾을 수 없습니다."
        description="모임을 다시 선택해 주세요."
        action={<ActionLink to="/my-journal">나의 항해 일지</ActionLink>}
      />
    );
  return (
    <PageContainer narrow>
      <PageHeading
        eyebrow="CREW JOURNAL / NEW"
        title="이번 항해는 어떠셨나요?"
        description={`${meetup.title} · ${meetup.book}`}
      />
      <ReviewForm key={meetup.id} meetupId={meetup.id} />
    </PageContainer>
  );
}
