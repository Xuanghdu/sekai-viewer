import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { CircularProgress, Typography, Stack } from "@mui/material";

import { Stage } from "@pixi/react";

import { Live2DController } from "../../utils/Live2DPlayer/Live2DController";
import { LoadStatus } from "../../utils/Live2DPlayer/types.d";
import type {
  ILive2DControllerData,
  ILive2DPlayerSettings,
} from "../../utils/Live2DPlayer/types.d";

import StoryReaderLive2DStage from "./StoryReaderLive2DStage";

const StoryReaderLive2DCanvas: React.FC<{
  controllerData: ILive2DControllerData;
  settings: ILive2DPlayerSettings;
  stageSize: [number, number];
}> = ({ controllerData, settings, stageSize }) => {
  const { t } = useTranslation();

  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<{
    controller: Live2DController;
    reloadStage: () => void;
  }>(null);

  const [scenarioStep, setScenarioStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [autoplayWaiting, setAutoplayWaiting] = useState(false);
  const [loadStatus, setLoadStatus] = useState<LoadStatus>(LoadStatus.Ready);

  /**
   * Next step process:
   * - triggered by user click:
   *   - if auto play or already playing: abort player / auto play delay
   *   - else: next step
   * - triggered by auto play / model load finish:
   *   - if not playing: next step
   */
  const nextStepClick = useCallback(() => {
    if (!playing && !autoplayWaiting && scenarioStep !== -1) {
      setPlaying(true);
      stage.current?.controller
        .step_until_checkpoint(scenarioStep)
        .then((current) => {
          setScenarioStep(current);
          setPlaying(false);
        });
    } else {
      stage.current?.controller.animate.abort();
    }
    if (scenarioStep === -1) setFinished(true);
  }, [autoplayWaiting, playing, scenarioStep]);

  const nextStepAuto = useCallback(() => {
    if (!playing && scenarioStep !== -1) {
      setPlaying(true);
      stage.current?.controller
        .step_until_checkpoint(scenarioStep)
        .then((current) => {
          setScenarioStep(current);
          setPlaying(false);
        });
    }
    if (scenarioStep === -1) setFinished(true);
  }, [playing, scenarioStep]);

  // autoplay listener
  useEffect(() => {
    if (loadStatus === LoadStatus.Loaded && settings.autoplay && !playing) {
      setAutoplayWaiting(true);
      stage.current?.controller.animate.delay(1500).then(() => {
        setAutoplayWaiting(false);
        nextStepAuto();
      });
    }
  }, [settings.autoplay, loadStatus, playing]);

  // other settings listeners
  useEffect(
    () =>
      stage.current?.controller.set_volume({
        bgm_volume: settings.bgmVolume / 100,
      }),
    [settings.bgmVolume]
  );
  useEffect(
    () =>
      stage.current?.controller.set_volume({
        voice_volume: settings.voiceVolume / 100,
      }),
    [settings.voiceVolume]
  );
  useEffect(
    () =>
      stage.current?.controller.set_volume({
        se_volume: settings.seVolume / 100,
      }),
    [settings.seVolume]
  );
  useEffect(() => {
    if (stage.current)
      stage.current.controller.settings.text_animation = settings.textAnimation;
  }, [settings.textAnimation]);

  /**
   * Handles left click to advance to the next step.
   */
  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loadStatus === LoadStatus.Loaded) {
      nextStepClick();
    }
  };

  /**
   * Handles right click to replay the last audio step.
   * Restores the state to the last saved entry without removing it.
   */
  const handleRightClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (
        loadStatus === LoadStatus.Loaded &&
        scenarioStep !== -1 &&
        stage.current?.controller.actionHistory.length
      ) {
        stage.current?.controller.animate.abort();
        const previousStep = stage.current.controller.actionHistory.pop();
        if (previousStep !== undefined) {
          stage.current?.controller.apply_action(previousStep);
          setScenarioStep(previousStep);
        }
      }
    },
    [loadStatus, scenarioStep]
  );

  /**
   * Handles mouse wheel event.
   * If the user scrolls upward (negative deltaY), we step back one saved state.
   */
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      // Check for upward scrolling (scroll back)
      if (e.deltaY < 0) {
        // e.preventDefault();
        e.stopPropagation();

        if (loadStatus === LoadStatus.Loaded && scenarioStep > 0) {
          // Abort any ongoing animation.
          stage.current?.controller.animate.abort();

          // If there's saved history, pop the last state and restore it.
          if (stage.current?.controller.actionHistory.length) {
            stage.current.controller.actionHistory.pop();
            const previousStep = stage.current.controller.actionHistory.pop();
            if (previousStep !== undefined) {
              stage.current?.controller.apply_action(previousStep);
              setScenarioStep(previousStep);
            }
          } else {
            // Fallback: simply decrement the scenario step.
            const previousStep = scenarioStep - 1;
            stage.current?.controller.apply_action(previousStep);
            setScenarioStep(previousStep);
          }
        }
      }
    },
    [loadStatus, scenarioStep]
  );

  const handleModelLoad = (status: LoadStatus) => {
    setLoadStatus(status);
    if (status === LoadStatus.Loaded) {
      if (stage.current) {
        stage.current.controller.settings.text_animation =
          settings.textAnimation;
        stage.current.controller.set_volume({
          bgm_volume: settings.bgmVolume / 100,
          se_volume: settings.seVolume / 100,
          voice_volume: settings.voiceVolume / 100,
        });
      }
      nextStepAuto();
    }
  };

  return (
    <Stack
      direction="column"
      sx={{
        justifyContent: "flex-start",
        alignItems: "stretch",
        position: "relative",
      }}
    >
      {playing && (
        <CircularProgress
          sx={{
            position: "absolute",
            top: 2,
            left: 2,
            width: 20,
            zIndex: 1500, // same as tooltip
          }}
        />
      )}
      {loadStatus === LoadStatus.Loading && (
        <Typography>
          {t("story_reader_live2d:progress.load_model_to_canvas")}
        </Typography>
      )}
      <div ref={wrap} style={{ position: "relative" }}>
        <Stage
          width={stageSize[0]}
          height={stageSize[1]}
          options={{
            backgroundColor: 0xfefefe,
            antialias: true,
            autoDensity: true,
          }}
          onClick={handlePlayClick}
          onContextMenu={handleRightClick} // Right click replays the last audio step.
          onWheel={handleWheel}
        >
          {controllerData && (
            <StoryReaderLive2DStage
              ref={stage}
              stageSize={stageSize}
              controllerData={controllerData}
              onModelLoad={handleModelLoad}
            />
          )}
        </Stage>
        {finished && (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              height: "100%",
              width: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
            }}
          >
            <Typography variant="h6">
              {t("story_reader_live2d:story_ended")}
            </Typography>
          </Stack>
        )}
      </div>
    </Stack>
  );
};

StoryReaderLive2DCanvas.displayName = "StoryReaderLive2DCanvas";
export default StoryReaderLive2DCanvas;
