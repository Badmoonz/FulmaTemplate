module App

open Elmish
open Elmish.React

open Fulma.Extensions
open Fulma.Components
open Fulma.Elements
open Fulma.Elements.Form
open Fulma.Layouts


open Fable.Helpers.React.Props
module R = Fable.Helpers.React

type Model = int

type Msg = Increment | Decrement

let init () = 0

let update msg (model : Model) =
  match msg with
  | Increment -> model + 1
  | Decrement -> model - 1

let view model dispatch =
  R.div []
      [ Heading.h1  [] [ R.str "SAFE Template" ]
        R.p  [] [ R.str "Press buttons to manipulate counter:" ]
        Button.button_a [ Button.isDanger;  Button.onClick (fun _ -> dispatch Decrement) ] [ R.str " - " ]
        R.div [] [ R.str (sprintf "%A" model) ]
        Button.button_a [ Button.isSuccess; Button.onClick (fun _ -> dispatch Increment) ] [ R.str " + " ]
      ]

Program.mkSimple init update view
|> Program.withReact "elmish-app"
// |> Program.withHMR
|> Program.run