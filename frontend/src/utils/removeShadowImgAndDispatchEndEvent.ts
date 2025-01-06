export const removeShadowImgAndDispatchEndEvent = (
  dragShadowImgRef: React.RefObject<HTMLImageElement | null>
) => {
  if (dragShadowImgRef.current) {
    dragShadowImgRef.current.remove(); // DOM에서 쉐도우 이미지 제거
    dragShadowImgRef.current = null; // 참조를 초기화하여 메모리에서 해제
  }

  // 터치 종료 이벤트를 커스텀 이벤트로 생성하여 dispatch
  const customEvent = new CustomEvent('character-touch-end');
  window.dispatchEvent(customEvent);
};
