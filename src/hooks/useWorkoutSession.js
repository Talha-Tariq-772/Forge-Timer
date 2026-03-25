import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clickSound from "../ClickSound.m4a";
import { buildSessionSegments } from "../utils/workout";

export default function useWorkoutSession({
  program,
  config,
  soundEnabled,
  onComplete,
}) {
  const segments = useMemo(() => buildSessionSegments(program, config), [
    config,
    program,
  ]);
  const segmentDurationsMs = useMemo(
    () => segments.map((segment) => segment.duration * 1000),
    [segments]
  );
  const totalDurationMs = useMemo(
    () => segmentDurationsMs.reduce((total, duration) => total + duration, 0),
    [segmentDurationsMs]
  );
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [remainingMs, setRemainingMs] = useState(
    segmentDurationsMs[0] ?? 0
  );
  const [status, setStatus] = useState("idle");
  const completionRef = useRef(false);
  const frameRef = useRef(0);
  const segmentIndexRef = useRef(0);
  const remainingMsRef = useRef(segmentDurationsMs[0] ?? 0);
  const statusRef = useRef("idle");
  const segmentEndTimeRef = useRef(0);

  const playCue = useCallback(() => {
    if (!soundEnabled || typeof Audio === "undefined") return;

    const sound = new Audio(clickSound);
    sound.volume = 0.35;
    sound.play().catch(() => {});
  }, [soundEnabled]);

  const stopLoop = useCallback(() => {
    if (!frameRef.current) return;

    window.cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
  }, []);

  const setSegmentSnapshot = useCallback((nextIndex, nextRemainingMs) => {
    segmentIndexRef.current = nextIndex;
    remainingMsRef.current = nextRemainingMs;
    setSegmentIndex(nextIndex);
    setRemainingMs(nextRemainingMs);
  }, []);

  useEffect(() => {
    completionRef.current = false;
    stopLoop();
    setSegmentSnapshot(0, segmentDurationsMs[0] ?? 0);
    statusRef.current = "idle";
    setStatus("idle");
    segmentEndTimeRef.current = 0;
  }, [segmentDurationsMs, setSegmentSnapshot, stopLoop]);

  useEffect(() => () => stopLoop(), [stopLoop]);

  const totalDuration = totalDurationMs / 1000;
  const currentSegment = segments[segmentIndex] ?? null;
  const currentSegmentDurationMs = segmentDurationsMs[segmentIndex] ?? 0;
  const completedDurationMs = segmentDurationsMs
    .slice(0, segmentIndex)
    .reduce((total, duration) => total + duration, 0);
  const elapsedSeconds =
    currentSegment && status !== "completed"
      ? (completedDurationMs + (currentSegmentDurationMs - remainingMs)) / 1000
      : totalDuration;
  const overallProgress = totalDuration
    ? Math.min(elapsedSeconds / totalDuration, 1)
    : 0;
  const segmentProgress = currentSegmentDurationMs
    ? Math.min(
        (currentSegmentDurationMs - remainingMs) / currentSegmentDurationMs,
        1
      )
    : 0;
  const displayRemainingSeconds =
    status === "completed" ? 0 : Math.max(0, Math.ceil(remainingMs / 1000));

  const resolveForwardSegment = useCallback(
    (currentIndex, overflowMs) => {
      let nextIndex = currentIndex;
      let carryMs = overflowMs;

      while (true) {
        const followingIndex = nextIndex + 1;

        if (followingIndex >= segmentDurationsMs.length) {
          return null;
        }

        nextIndex = followingIndex;
        const nextDurationMs = segmentDurationsMs[nextIndex];

        if (carryMs < nextDurationMs) {
          return {
            index: nextIndex,
            remainingMs: nextDurationMs - carryMs,
          };
        }

        carryMs -= nextDurationMs;
      }
    },
    [segmentDurationsMs]
  );

  const completeSession = useCallback(() => {
    stopLoop();
    segmentIndexRef.current = Math.max(segments.length - 1, 0);
    setSegmentIndex(Math.max(segments.length - 1, 0));
    statusRef.current = "completed";
    setStatus("completed");
    remainingMsRef.current = 0;
    setRemainingMs(0);

    if (!completionRef.current) {
      completionRef.current = true;
      playCue();
      onComplete?.({
        totalDuration,
        completedAt: new Date().toISOString(),
      });
    }
  }, [onComplete, playCue, segments.length, stopLoop, totalDuration]);

  const tick = useCallback(
    (now) => {
      if (statusRef.current !== "running") return;

      const msLeft = segmentEndTimeRef.current - now;

      if (msLeft > 0) {
        remainingMsRef.current = msLeft;
        setRemainingMs(msLeft);
        frameRef.current = window.requestAnimationFrame(tick);
        return;
      }

      const nextSegment = resolveForwardSegment(
        segmentIndexRef.current,
        Math.abs(msLeft)
      );

      if (!nextSegment) {
        completeSession();
        return;
      }

      setSegmentSnapshot(nextSegment.index, nextSegment.remainingMs);
      segmentEndTimeRef.current = now + nextSegment.remainingMs;
      playCue();
      frameRef.current = window.requestAnimationFrame(tick);
    },
    [completeSession, playCue, resolveForwardSegment, setSegmentSnapshot]
  );

  const startLoop = useCallback(() => {
    if (!segmentDurationsMs.length) return;

    stopLoop();
    statusRef.current = "running";
    setStatus("running");
    segmentEndTimeRef.current = performance.now() + remainingMsRef.current;
    frameRef.current = window.requestAnimationFrame(tick);
  }, [segmentDurationsMs.length, stopLoop, tick]);

  const moveToSegment = useCallback(
    (nextIndex, nextStatus = "paused") => {
      if (!segments.length) return;

      stopLoop();

      if (nextIndex < 0) {
        completionRef.current = false;
        setSegmentSnapshot(0, segmentDurationsMs[0] ?? 0);
        statusRef.current = "idle";
        setStatus("idle");
        return;
      }

      if (nextIndex >= segments.length) {
        completeSession();
        return;
      }

      completionRef.current = false;
      setSegmentSnapshot(nextIndex, segmentDurationsMs[nextIndex] ?? 0);
      statusRef.current = nextStatus;
      setStatus(nextStatus);
      playCue();

      if (nextStatus === "running") {
        segmentEndTimeRef.current = performance.now() + remainingMsRef.current;
        frameRef.current = window.requestAnimationFrame(tick);
      }
    },
    [
      completeSession,
      playCue,
      segmentDurationsMs,
      segments.length,
      setSegmentSnapshot,
      stopLoop,
      tick,
    ]
  );

  function start() {
    completionRef.current = false;
    setSegmentSnapshot(0, segmentDurationsMs[0] ?? 0);
    playCue();
    startLoop();
  }

  function pause() {
    if (statusRef.current !== "running") return;

    const nextRemainingMs = Math.max(
      0,
      segmentEndTimeRef.current - performance.now()
    );

    stopLoop();
    remainingMsRef.current = nextRemainingMs;
    setRemainingMs(nextRemainingMs);
    statusRef.current = "paused";
    setStatus("paused");
  }

  function resume() {
    if (!currentSegment || status === "completed") return;
    startLoop();
  }

  function reset() {
    completionRef.current = false;
    stopLoop();
    setSegmentSnapshot(0, segmentDurationsMs[0] ?? 0);
    statusRef.current = "idle";
    setStatus("idle");
  }

  function next() {
    moveToSegment(segmentIndexRef.current + 1);
  }

  function previous() {
    moveToSegment(segmentIndexRef.current - 1);
  }

  return {
    segments,
    currentSegment,
    remainingMs,
    remainingSeconds: displayRemainingSeconds,
    segmentIndex,
    status,
    totalDuration,
    elapsedSeconds,
    overallProgress,
    segmentProgress,
    isRunning: status === "running",
    isCompleted: status === "completed",
    start,
    pause,
    resume,
    reset,
    next,
    previous,
  };
}
