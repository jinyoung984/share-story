import { Link } from 'react-router-dom';

import styles from './DetailBottomBar.module.css';

interface DetailBottomBarProps {
  meetupId: number;
  canEdit: boolean;
  onJoin: () => void;
  isJoining?: boolean;
}

function DetailBottomBar({ meetupId, canEdit, onJoin, isJoining = false }: DetailBottomBarProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <Link to="/meetups" className={styles.listButton}>
          목록으로
        </Link>

        {canEdit ? (
          <Link to={`/meetups/${meetupId}/edit`} className={styles.editButton}>
            항해수정
          </Link>
        ) : (
          <button type="button" className={styles.editButton} disabled>
            항해수정
          </button>
        )}

        {/* leader_id 로그인 사용자는 본인 항해에 참여 신청할 수 없으므로 버튼을 노출하지 않는다. */}
        {!canEdit && (
          <button type="button" className={styles.joinButton} onClick={onJoin} disabled={isJoining}>
            {isJoining ? '신청 중...' : '항해 참여하기'}
          </button>
        )}
      </div>
    </div>
  );
}

export default DetailBottomBar;
