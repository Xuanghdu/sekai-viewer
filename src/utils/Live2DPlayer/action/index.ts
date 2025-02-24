import type { Live2DController } from "../Live2DController";
import type { Snippet } from "../../../types.d";
import { SnippetAction } from "../../../types.d";
import { log } from "../log";

import action_talk from "./talk";
import action_sound from "./sound";
import action_motion from "./character_motion";
import action_layout from "./character_layout";
import action_se from "./special_effect";
import { replaceStrings, stringReplacements } from "../StringReplacement";

export default async function single_action(
  controller: Live2DController,
  action: Snippet
) {
  switch (action.Action) {
    case SnippetAction.SpecialEffect:
      const action_detail =
        controller.scenarioData.SpecialEffectData[action.ReferenceIndex];
      action_detail.StringVal = replaceStrings(
        action_detail.StringVal,
        stringReplacements
      );
      if (action_detail.StringValSub.startsWith("voice")) {
        controller.lastAudioStep = controller.currentScenarioStep;
      }
      await action_se(controller, action);
      break;
    case SnippetAction.CharacterLayout:
      await action_layout(controller, action);
      break;
    case SnippetAction.CharacterMotion:
      await action_motion(controller, action);
      break;
    case SnippetAction.Talk:
      controller.lastAudioStep = controller.currentScenarioStep;
      await action_talk(controller, action);
      break;
    case SnippetAction.Sound:
      await action_sound(controller, action);
      break;
    default:
      log.warn(
        "Live2DController",
        `${SnippetAction[action.Action]} not implemented!`,
        action
      );
  }
}
